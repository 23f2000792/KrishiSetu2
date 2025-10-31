'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { Paperclip, Loader2 } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  content: z.string().min(10, { message: 'Post must be at least 10 characters long.' }),
  image: z.any().optional(),
  language: z.string({ required_error: 'Please select a language.' }),
});

export function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
    const { toast } = useToast();
    const { t } = useLanguage();
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { content: '', language: 'English' },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in to create a post.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // In a real app, you would handle image uploads to a service like Firebase Storage
            // and get a URL back. For now, we'll ignore the image.
            
            const postData = {
                authorId: user.id,
                authorName: user.name,
                authorAvatar: user.avatar || '',
                content: values.content,
                language: values.language,
                upvotes: 0,
                comments: [],
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(firestore, 'posts'), postData);

            toast({
                title: t('community.postCreated'),
                description: t('community.postCreatedDesc'),
            });
            onPostCreated();
            form.reset();
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create post. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder={t('community.messagePlaceholder')}
                                    rows={5}
                                    className="resize-none border-0 focus-visible:ring-0 shadow-none p-0 text-base"
                                    {...field}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase text-muted-foreground">{t('community.language')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('community.selectLanguage')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="English">{t('header.english')}</SelectItem>
                                        <SelectItem value="Hindi">{t('header.hindi')}</SelectItem>
                                        <SelectItem value="Punjabi">{t('header.punjabi')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem className="hidden">
                            <FormControl>
                                <Input type="file" ref={imageInputRef} onChange={(e) => field.onChange(e.target.files)} disabled={isSubmitting} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-between items-center">
                    <Button type="button" variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()} disabled={isSubmitting}>
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('community.postToCommunity')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
