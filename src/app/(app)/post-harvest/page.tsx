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
import { analyzeProfitability } from '@/ai/flows/profit-analyst-flow';
import type { PostHarvestReport } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { costInputSchema, costInputObject } from '@/lib/schemas/profit-analysis';
import { PostHarvestReportCard } from './components/post-harvest-report-card';


const formSchema = z.object({
    crop: z.string({ required_error: 'Please select a crop to analyze.' }),
    actualYield: z.coerce.number().min(0.1, 'Please enter a valid yield amount.'),
    ...costInputSchema,
});

export default function PostHarvestAnalyticsPage() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<PostHarvestReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { 
            crop: user?.crops?.[0] || '',
            actualYield: 0,
            seedCost: 0,
            fertilizerCost: 0,
            pesticideCost: 0,
            laborCost: 0,
            irrigationCost: 0,
            transportCost: 0,
            otherCost: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !user.farmSize || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User data is incomplete or database is not ready. Please try again.' });
            return;
        }

        setLoading(true);
        setError(null);
        setReport(null);

        try {
            // MOCK: In a real app, this would be fetched from a db or previous AI run
            const predictedYieldPerAcre = 18.2; 
            const actualYieldPerAcre = values.actualYield / user.farmSize;

            const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };

            // Run both analyses in parallel
            const [yieldResult, profitResult] = await Promise.all([
                analyzeYieldDeviation({
                    crop: values.crop,
                    predictedYield: predictedYieldPerAcre,
                    actualYield: actualYieldPerAcre,
                    userId: user.id,
                    language: languageMap[locale],
                }),
                analyzeProfitability({
                    ...values,
                    region: user.region,
                })
            ]);

            const newReport: Omit<PostHarvestReport, 'id' | 'createdAt'> = {
                userId: user.id,
                crop: values.crop,
                farmSize: user.farmSize,
                predictedYield: predictedYieldPerAcre,
                actualYield: actualYieldPerAcre,
                deviation: yieldResult.deviation,
                analysis: yieldResult.analysis,
                costs: {
                    seedCost: values.seedCost,
                    fertilizerCost: values.fertilizerCost,
                    pesticideCost: values.pesticideCost,
                    laborCost: values.laborCost,
                    irrigationCost: values.irrigationCost,
                    transportCost: values.transportCost,
                    otherCost: values.otherCost,
                },
                results: {
                    totalCost: profitResult.totalCost,
                    totalRevenue: profitResult.totalRevenue,
                    netProfit: profitResult.netProfit,
                    roi: profitResult.roi,
                }
            };
            
            // This could be stored in a new 'post_harvest_reports' collection
            const docRef = await addDoc(collection(firestore, 'yield_reports'), {
                ...newReport,
                createdAt: serverTimestamp(),
            });

            setReport({ ...newReport, id: docRef.id, createdAt: new Date().toISOString() as any });

        } catch (e) {
            console.error(e);
            setError('Failed to generate the analysis. Please try again.');
            toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Failed to generate the post-harvest analysis.' });
        } finally {
            setLoading(false);
        }
    }

    if (report) {
        return <PostHarvestReportCard report={report} onNew={() => setReport(null)} />;
    }

    return (
        <div className="animate-fade-in pb-16 md:pb-0">
            <PageHeader
                title="Post-Harvest Analytics"
                description="Analyze your harvest yield and profitability."
            />
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Enter Your Harvest Details</CardTitle>
                    <CardDescription>Provide your final yield numbers and costs to get a complete analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    name="actualYield"
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
                            </div>
                            
                            <div>
                                <FormLabel className="text-lg font-medium">Harvest Costs</FormLabel>
                                <p className="text-sm text-muted-foreground mb-4">Enter all costs associated with this harvest in Rupees (₹).</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {(Object.keys(costInputObject.shape) as Array<keyof typeof costInputObject.shape>).map((key) => (
                                        <FormField
                                            key={key}
                                            control={form.control}
                                            name={key}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').replace('Cost', ' Cost')}</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="in ₹" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full text-lg py-6">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Full Report
                            </Button>
                             {error && <p className="text-destructive text-center">{error}</p>}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
