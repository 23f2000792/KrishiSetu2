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
import { analyzeProfitability, costInputSchema } from '@/ai/flows/profit-analyst-flow';
import type { ProfitReport } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { ProfitReportCard } from './components/profit-report-card';

const formSchema = z.object({
    crop: z.string({ required_error: 'Please select a crop.' }),
    actualYield: z.coerce.number().min(0.1, 'Please enter a valid yield amount.'),
    ...costInputSchema
});

export default function ProfitabilityDashboardPage() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<ProfitReport | null>(null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { 
            crop: user?.crops?.[0] || '',
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
            toast({ variant: 'destructive', title: 'Error', description: 'User data is incomplete.' });
            return;
        }

        setLoading(true);
        setReport(null);

        try {
            const analysisResult = await analyzeProfitability({
                ...values,
                region: user.region,
            });

            const costInputs = {
                seedCost: values.seedCost,
                fertilizerCost: values.fertilizerCost,
                pesticideCost: values.pesticideCost,
                laborCost: values.laborCost,
                irrigationCost: values.irrigationCost,
                transportCost: values.transportCost,
                otherCost: values.otherCost,
            }

            const newReportData: Omit<ProfitReport, 'id' | 'createdAt'> = {
                userId: user.id,
                crop: values.crop,
                farmSize: user.farmSize,
                costs: costInputs,
                results: {
                    totalCost: analysisResult.totalCost,
                    totalRevenue: analysisResult.totalRevenue,
                    netProfit: analysisResult.netProfit,
                    roi: analysisResult.roi,
                }
            };

            const docRef = await addDoc(collection(firestore, 'profit_reports'), {
                ...newReportData,
                createdAt: serverTimestamp(),
            });

            setReport({ 
                ...newReportData, 
                id: docRef.id, 
                createdAt: new Date() as any // Temporary, Firestore will overwrite
            });
            form.reset();

        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Failed to generate profitability analysis.' });
        } finally {
            setLoading(false);
        }
    }

    if (report) {
        return <ProfitReportCard report={report} onNew={() => setReport(null)} />;
    }

    return (
        <div className="animate-fade-in pb-16 md:pb-0">
            <PageHeader
                title="Cost &amp; Profitability"
                description="Enter your expenses to calculate the profitability of your harvest."
            />
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>New Profitability Report</CardTitle>
                    <CardDescription>Fill in the costs associated with your latest harvest.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="crop"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Crop</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select a crop..." /></SelectTrigger>
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
                                            <FormLabel>Total Yield (in quintals)</FormLabel>
                                            <FormControl><Input type="number" step="0.1" placeholder="e.g., 85.5" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(Object.keys(costInputSchema) as Array<keyof typeof costInputSchema>).map((key) => (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={key}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{key.replace('Cost', ' Cost')}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="in ₹" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Calculate Profit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
