
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  crop1: z.string().optional(),
  crop2: z.string().optional(),
  crop3: z.string().optional(),
  crop4: z.string().optional(),
  crop5: z.string().optional(),
}).refine(data => {
    return !!data.crop1 || !!data.crop2 || !!data.crop3 || !!data.crop4 || !!data.crop5;
}, {
    message: 'Please select at least one crop.',
    path: ['crop1'], // Arbitrarily assign error to the first crop field
});

export function OnboardingForm({ onFinished }: { onFinished: () => void }) {
    const { user, updateUserProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { farmSize: 1 },
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

        const crops = [values.crop1, values.crop2, values.crop3, values.crop4, values.crop5].filter(Boolean) as string[];

        try {
            await updateUserProfile(user.id, {
                farmSize: values.farmSize,
                crops: crops,
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
                
                <div className="space-y-4">
                    <FormLabel>What crops are you growing? (Select up to 5)</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <FormField
                                key={i}
                                control={form.control}
                                name={`crop${i}` as 'crop1' | 'crop2' | 'crop3' | 'crop4' | 'crop5'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs text-muted-foreground">Crop {i}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select crop" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="">None</SelectItem>
                                                {CROP_OPTIONS.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Started
                </Button>
            </form>
        </Form>
    );
}
