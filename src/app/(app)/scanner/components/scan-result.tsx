'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanResult } from '@/lib/types';
import { CheckCircle, Save, AlertTriangle, Scan, Bot, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type ScanResultCardProps = {
  result: ScanResult;
  onNewScan: () => void;
};

export function ScanResultCard({ result, onNewScan }: ScanResultCardProps) {
    const isHealthy = result.prediction.toLowerCase().includes('healthy');
    const [confidence, setConfidence] = useState(0);
    const { t } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => setConfidence(Math.round(result.confidence * 100)), 300);
        return () => clearTimeout(timer);
    }, [result.confidence]);

    const handleAskCopilot = () => {
        const prompt = t('scanner.copilotPrompt')
            .replace('{prediction}', result.prediction)
            .replace('{recommendations}', result.recommendedSteps);
        
        // Use sessionStorage to avoid long URIs
        sessionStorage.setItem('copilot-prompt', prompt);
        sessionStorage.setItem('copilot-image', result.imageUrl);

        router.push('/chat');
    };

    const handleSave = () => {
        toast({
            title: t('scanner.recordSavedTitle'),
            description: t('scanner.recordSavedDesc'),
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: t('scanner.shareTitle'),
            text: `${t('scanner.shareText')} ${result.prediction} (${t('scanner.confidence')}: ${confidence}%). ${t('scanner.recommendations')}: ${result.recommendedSteps}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support navigator.share
                await navigator.clipboard.writeText(shareData.text);
                toast({
                    title: t('scanner.copiedToClipboardTitle'),
                    description: t('scanner.copiedToClipboardDesc'),
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
             toast({
                variant: 'destructive',
                title: t('scanner.shareErrorTitle'),
                description: t('scanner.shareErrorDesc'),
            });
        }
    };

  return (
    <Card className="animate-fade-in-up w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">{t('scanner.scanResult')}</CardTitle>
        <CardDescription>{t('scanner.analysisComplete')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video rounded-xl overflow-hidden border-4 border-primary/50 shadow-lg animate-fade-in-right w-full">
          <Image src={result.imageUrl} alt="Scanned leaf" fill className="object-contain" />
        </div>
        
        <div className="space-y-6 animate-fade-in-left" style={{ animationDelay: '200ms' }}>
            <div className='text-center p-4 bg-card rounded-lg border'>
                 <Badge variant={isHealthy ? 'default' : 'destructive'} className={`${isHealthy ? 'bg-green-600' : 'bg-red-600'} text-white text-base py-1 px-3 mb-2`}>
                    {isHealthy ? <CheckCircle className="mr-2 h-4 w-4" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                    {result.prediction}
                </Badge>
                <p className='text-sm text-muted-foreground'>{t('scanner.aiAnalysis')}</p>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-center mb-2">{t('scanner.confidence')}</h3>
                <div className="flex items-center gap-4">
                    <Progress value={confidence} className="w-full h-3" />
                    <span className="font-bold text-lg text-primary">{confidence}%</span>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-center mb-2">{t('scanner.recommendations')}</h3>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-md border">{result.recommendedSteps}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className='flex flex-col sm:flex-row w-full gap-2'>
             <Button className="w-full" onClick={handleAskCopilot}>
                <Bot className="mr-2 h-4 w-4" />
                {t('scanner.askCopilot')}
            </Button>
            <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                {t('scanner.saveToRecords')}
            </Button>
        </div>
        <div className='flex flex-col sm:flex-row w-full gap-2'>
            <Button variant="outline" className="w-full" onClick={onNewScan}>
                <Scan className="mr-2 h-4 w-4" />
                {t('scanner.scanAnother')}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                {t('scanner.shareResult')}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
