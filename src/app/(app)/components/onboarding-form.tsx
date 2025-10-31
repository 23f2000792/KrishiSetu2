
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { CropMultiSelect } from './crop-multiselect';

export const CROP_OPTIONS = [
    { value: "Wheat", label: "Wheat" },
    { value: "Rice", label: "Rice" },
    { value: "Cotton", label: "Cotton" },
    { value: "Sugarcane", label: "Sugarcane" },
    { value: "Maize", label: "Maize" },
    { value: "Soybean", label: "Soybean" },
    { value: "Potato", label: "Potato" },
    { value: "Tomato", label: "Tomato" },
    { value: "Onion", label: "Onion" },
    { value: "Mustard", label: "Mustard" },
];

const formSchema = z.object({
  farmSize: z.coerce.number().min(0.1, 'Please enter a valid farm size.'),
  crops: z.array(z.string()).min(1, 'Please select at least one crop.').max(5, 'You can select up to 5 crops.'),
});

export function OnboardingForm({ onFinished }: { onFinished: () => void }) {
    const { user, updateUserProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { farmSize: 1, crops: [] },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await updateUserProfile(user.id, {
                farmSize: values.farmSize,
                crops: values.crops,
            });
            toast({
                title: "Information Saved!",
                description: "Your dashboard is now personalized.",
            });
            onFinished();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save information. Please try again.',
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
                    name="farmSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Farm Size (in acres)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 4.2" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="crops"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What crops are you growing? (Select up to 5)</FormLabel>
                           <CropMultiSelect 
                                selected={field.value}
                                onChange={field.onChange}
                           />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Started
                </Button>
            </form>
        </Form>
    );
}
