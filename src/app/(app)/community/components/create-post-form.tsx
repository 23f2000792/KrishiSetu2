'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { Paperclip, Loader2, X } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

const formSchema = z.object({
  content: z.string().min(10, { message: 'Post must be at least 10 characters long.' }),
  language: z.string({ required_error: 'Please select a language.' }),
});

// Function to convert file to data URL
const toDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
});

function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
    const { toast } = useToast();
    const { t } = useLanguage();
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { content: '', language: 'English' },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    variant: 'destructive',
                    title: 'File too large',
                    description: 'Please select an image smaller than 5MB.',
                });
                return;
            }
            setImageFile(file);
        }
    };

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
        let imageUrl: string | undefined = undefined;
        
        const postsColRef = collection(firestore, 'posts');

        try {
            if (imageFile) {
                imageUrl = await toDataURL(imageFile);
            }
            
            const postData = {
                authorId: user.id,
                authorName: user.name,
                authorAvatar: user.avatar || '',
                content: values.content,
                image: imageUrl,
                language: values.language,
                upvotes: 0,
                comments: [], // Kept for schema compatibility but not used for writing
                createdAt: serverTimestamp(),
            };

            await addDoc(postsColRef, postData);

            toast({
                title: t('community.postCreated'),
                description: t('community.postCreatedDesc'),
            });
            onPostCreated();
            form.reset({ content: '', language: 'English' });
            setImageFile(null);
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error creating post:', error);
            const permissionError = new FirestorePermissionError({
                path: postsColRef.path,
                operation: 'create',
                requestResourceData: { content: values.content, language: values.language },
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create post. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (!user) return null;
    
    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                 <CardHeader className="flex-row items-start gap-4 p-4">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('community.messagePlaceholder')}
                                            rows={3}
                                            className="resize-none border-0 focus-visible:ring-0 shadow-none p-0 text-base"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <Input 
                        type="file" 
                        ref={imageInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/png, image/jpeg"
                        disabled={isSubmitting} 
                    />
                    {imageFile && (
                        <div className="mt-2">
                             <Badge variant="secondary" className="flex items-center justify-between">
                                <span>{imageFile.name}</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 ml-2" 
                                    onClick={() => {
                                        setImageFile(null);
                                        if (imageInputRef.current) imageInputRef.current.value = '';
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </Badge>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-4 pt-0 gap-2">
                    <div className="flex gap-2 self-start sm:self-center">
                        <Button type="button" variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()} disabled={isSubmitting}>
                            <Paperclip className="h-5 w-5 text-muted-foreground" />
                        </Button>
                         <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                        <FormControl>
                                            <SelectTrigger className="w-auto border-0 bg-transparent text-muted-foreground">
                                                <SelectValue placeholder={t('community.selectLanguage')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="English">{t('header.english')}</SelectItem>
                                            <SelectItem value="Hindi">{t('header.hindi')}</SelectItem>
                                            <SelectItem value="Punjabi">{t('header.punjabi')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full sm:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('community.postToCommunity')}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
}


export function CreatePostCard({ onPostCreated }: { onPostCreated: () => void }) {
    return (
        <Card>
            <CreatePostForm onPostCreated={onPostCreated} />
        </Card>
    )
}
