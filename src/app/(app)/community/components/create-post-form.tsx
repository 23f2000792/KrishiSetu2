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

const formSchema = z.object({
  content: z.string().min(10, { message: 'Post must be at least 10 characters long.' }),
  image: z.any().optional(),
  language: z.string({ required_error: 'Please select a language.' }),
});

export function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
    const { toast } = useToast();
    const { t } = useLanguage();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { content: '' },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast({
            title: t('community.postCreated'),
            description: t('community.postCreatedDesc'),
        });
        onPostCreated();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('community.yourMessage')}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={t('community.messagePlaceholder')}
                                    rows={5}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('community.attachImage')}</FormLabel>
                                <FormControl>
                                    <Input type="file" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('community.language')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <div className="flex justify-end">
                    <Button type="submit">{t('community.postToCommunity')}</Button>
                </div>
            </form>
        </Form>
    );
}
