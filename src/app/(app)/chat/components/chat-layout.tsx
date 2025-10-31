'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiCopilotAgriAdvisory } from '@/ai/flows/ai-copilot-agri-advisory';
import { suggestQuickPrompts } from '@/ai/flows/suggest-quick-prompts';
import { useLanguage } from '@/contexts/language-context';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
};

export function ChatLayout() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const result = await suggestQuickPrompts();
        setQuickPrompts(result.prompts);
      } catch (error) {
        console.error("Failed to fetch quick prompts", error);
        setQuickPrompts([
            "Best time to plant wheat in Punjab?",
            "How to treat leaf rust on my crops?",
            "What is the market forecast for cotton?",
        ]);
      }
    };
    fetchPrompts();
  }, []);

  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialImage = searchParams.get('image');
    if (initialPrompt) {
      handleSend(initialPrompt, initialImage ?? undefined);
    }
    // We only want this to run once on mount when the page loads with search params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (prompt?: string, image?: string) => {
    const textToSend = prompt || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = { 
        id: Date.now().toString(), 
        text: textToSend, 
        isUser: true,
        image: image 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await aiCopilotAgriAdvisory({ query: textToSend });
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: result.advice, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI response error:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: t('chat.error'), isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={cn('flex items-start gap-4', message.isUser ? 'justify-end' : 'justify-start')}>
              {!message.isUser && (
                <Avatar className="h-9 w-9 border-2 border-primary">
                   <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                    <Bot size={20} />
                  </div>
                </Avatar>
              )}
              <div className={cn('max-w-xs md:max-w-md lg:max-w-2xl rounded-lg p-3', message.isUser ? 'bg-primary text-primary-foreground' : 'bg-card border')}>
                {message.image && (
                  <div className="relative aspect-video w-full mb-2 rounded-md overflow-hidden border">
                    <Image src={message.image} alt={t('chat.scannedImageAlt')} fill className="object-contain" />
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.isUser && user && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border-2 border-primary">
                    <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                        <Bot size={20} />
                    </div>
                </Avatar>
                <div className="max-w-xs md:max-w-md rounded-lg p-3 bg-card border">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
          )}
          {messages.length === 0 && !loading && (
             <Card className="bg-transparent border-dashed">
                <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 bg-primary/10 p-4 rounded-full w-fit">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium">{t('chat.welcomeMessage')}</p>
                    <p className="text-muted-foreground text-sm mt-1">{t('chat.welcomeHint')}</p>
                     <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {quickPrompts.map(prompt => (
                            <Badge key={prompt} variant="secondary" className="cursor-pointer hover:bg-primary/10" onClick={() => handleSend(prompt)}>
                                {prompt}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
      <div className="p-1">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder={t('chat.inputPlaceholder')}
            className="pr-24 h-12 rounded-full"
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" disabled={loading} aria-label={t('chat.micButton')}>
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" className="rounded-full" onClick={() => handleSend()} disabled={loading || !input.trim()} aria-label={t('chat.sendButton')}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
