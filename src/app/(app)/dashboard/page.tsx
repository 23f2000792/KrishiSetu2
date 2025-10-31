'use client';
import { PageHeader } from "@/components/page-header"
import { Bot, Droplets, Leaf, LineChart, Bug, ShoppingCart, Tractor, CalendarRange } from "lucide-react";
import SummaryCard from "./components/summary-card";
import { MarketChart } from "./components/market-chart";
import { QuickActions } from "./components/quick-actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { diseaseOutbreakPredictionFlow } from "@/ai/flows/disease-outbreak-prediction";
import { useEffect, useState } from "react";
import Link from "next/link";
import { simulateCropGrowth } from "@/ai/flows/crop-growth-simulation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const [outbreakAlert, setOutbreakAlert] = useState<string | null>(null);
    const [yieldPrediction, setYieldPrediction] = useState<string | null>(null);
    const [loadingYield, setLoadingYield] = useState(true);

    const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };

    useEffect(() => {
        const getPredictions = async () => {
            if (!user) return;
            
            // Outbreak Prediction
            try {
                const outbreakResult = await diseaseOutbreakPredictionFlow({
                    crop: user.crops?.[0] || 'Wheat',
                    region: user.region,
                    language: languageMap[locale],
                });
                setOutbreakAlert(outbreakResult.alert);
            } catch (error) {
                console.error("Failed to get outbreak prediction:", error);
                setOutbreakAlert(t('dashboard.outbreakError'));
            }

            // Yield Prediction
            setLoadingYield(true);
            try {
                 const growthResult = await simulateCropGrowth({
                    crop: user.crops?.[0] || 'Wheat',
                    region: user.region,
                    language: languageMap[locale],
                    soilReport: { pH: 6.8, N: "Medium", P: "High", K: "Medium", OC: 0.6 },
                });
                setYieldPrediction(growthResult.finalYieldPrediction.split(':')[1].split(' vs.')[0].trim());
            } catch (error) {
                console.error("Failed to get yield prediction:", error);
                setYieldPrediction("N/A");
            } finally {
                setLoadingYield(false);
            }
        };
        if(user?.farmSize) { // Only run if user has been onboarded
          getPredictions();
        }
    }, [user, locale, t]);


    const summaryCards = [
        { title: t('dashboard.soilFertility'), value: "82/100", icon: Leaf, details: t('dashboard.healthy'), trend: "up" as const, change: "+5%" },
        { title: t('dashboard.irrigation'), value: "In 2 days", icon: Droplets, details: t('dashboard.soilMoisture') },
        { title: t('dashboard.mandiForecast'), value: "+4.3%", icon: LineChart, details: `${user?.crops?.[0] || 'Wheat'} price`, trend: "up" as const },
        { title: t('dashboard.outbreakAlert'), value: "High Risk", icon: Bug, details: outbreakAlert || t('dashboard.loading') },
    ];
    
    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={`👋 ${t('dashboard.greeting')}, ${user?.name.split(' ')[0]}!`}
                description={user?.farmSize ? `${user?.region} | ${user.crops?.[0] || 'Crop'} | ${user.farmSize} acres` : user?.region}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {summaryCards.map((card, index) => (
                    <SummaryCard 
                        key={card.title}
                        {...card}
                        animationDelay={index * 100}
                    />
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <Link href="/growth-forecast">
                        <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
                             <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <CalendarRange className="h-6 w-6 text-primary" />
                                        <CardTitle>30-Day Growth Forecast</CardTitle>
                                    </div>
                                    <span className="text-sm text-primary hover:underline">View Timeline &rarr;</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loadingYield ? (
                                    <Skeleton className="h-8 w-2/3" />
                                ) : (
                                    <p className="text-2xl font-bold text-foreground">
                                        {yieldPrediction}
                                        <span className="text-base font-normal text-muted-foreground"> / acre (Predicted Yield)</span>
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground mt-1">AI-powered simulation of your crop's upcoming growth cycle.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <MarketChart crops={user?.crops} />
                </div>
                <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                     <div className="space-y-8">
                        <QuickActions />
                    </div>
                </div>
            </div>
        </div>
    )
}
