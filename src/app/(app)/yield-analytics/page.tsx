'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/page-header';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { analyzeYieldDeviation } from '@/ai/flows/yield-analysis-flow';
import type { YieldReport } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { YieldReportCard } from './components/yield-report-card';


const formSchema = z.object({
    crop: z.string({ required_error: 'Please select a crop to analyze.' }),
    totalYield: z.coerce.number().min(0.1, 'Please enter a valid yield amount.'),
});

export default function YieldAnalyticsPage() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<YieldReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { crop: user?.crops?.[0] || '', totalYield: 0 },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !user.farmSize || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User data is incomplete.' });
            return;
        }

        setLoading(true);
        setError(null);
        setReport(null);

        try {
            // MOCK: In a real app, this would be fetched from a db or previous AI run
            const predictedYieldPerAcre = 18.2; 
            const actualYieldPerAcre = values.totalYield / user.farmSize;

            const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };
            const analysisResult = await analyzeYieldDeviation({
                crop: values.crop,
                predictedYield: predictedYieldPerAcre,
                actualYield: actualYieldPerAcre,
                userId: user.id,
                language: languageMap[locale],
            });

            const newReport: Omit<YieldReport, 'id' | 'createdAt'> = {
                userId: user.id,
                crop: values.crop,
                farmSize: user.farmSize,
                predictedYield: predictedYieldPerAcre,
                actualYield: actualYieldPerAcre,
                deviation: analysisResult.deviation,
                analysis: analysisResult.analysis,
            };

            const docRef = await addDoc(collection(firestore, 'yield_reports'), {
                ...newReport,
                createdAt: serverTimestamp(),
            });

            setReport({ ...newReport, id: docRef.id, createdAt: new Date().toISOString() as any });

        } catch (e) {
            console.error(e);
            setError('Failed to generate yield analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (report) {
        return <YieldReportCard report={report} onNew={() => setReport(null)} />;
    }

    return (
        <div className="animate-fade-in pb-16 md:pb-0">
            <PageHeader
                title="Yield &amp; Output Analytics"
                description="Record your harvest and get an AI-powered analysis of your performance."
            />
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Enter Your Harvest Details</CardTitle>
                    <CardDescription>Provide your final yield numbers to compare against the AI's predictions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="crop"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Crop</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a crop..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {user?.crops?.map(crop => (
                                                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="totalYield"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Actual Yield (in quintals)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" placeholder="e.g., 85.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Analyze My Yield
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
