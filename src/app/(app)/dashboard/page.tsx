
'use client';
import { PageHeader } from "@/components/page-header"
import { Droplets, Leaf, Bug, Target } from "lucide-react";
import SummaryCard from "./components/summary-card";
import { MarketChart } from "./components/market-chart";
import { QuickActions } from "./components/quick-actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { diseaseOutbreakPredictionFlow } from "@/ai/flows/disease-outbreak-prediction";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { simulateCropGrowth } from "@/ai/flows/crop-growth-simulation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { SoilReport } from "@/lib/types";
import { useUserCollection } from "@/firebase/firestore/use-user-collection";
import { CalendarRange } from "lucide-react";


export default function DashboardPage() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    
    // AI State
    const [outbreakAlert, setOutbreakAlert] = useState<string | null>(null);
    const [yieldPrediction, setYieldPrediction] = useState<string | null>(null);

    // Loading State
    const [loadingAI, setLoadingAI] = useState(true);

    const { data: soilReports, isLoading: soilReportsLoading } = useUserCollection<SoilReport>(
        'soil_reports',
        { orderBy: ['uploadedAt', 'desc'], limit: 1 }
    );
    const latestSoilReport = useMemo(() => soilReports?.[0] || null, [soilReports]);
    
    const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };
    const primaryCrop = useMemo(() => user?.crops?.[0] || 'Wheat', [user?.crops]);

    useEffect(() => {
        const getPredictions = async () => {
            if (!user?.farmSize) {
                setLoadingAI(false);
                return;
            };

            setLoadingAI(true);
            
            try {
                const [outbreakResult, growthResult] = await Promise.all([
                     diseaseOutbreakPredictionFlow({
                        crop: primaryCrop,
                        region: user.region,
                        language: languageMap[locale],
                    }),
                    simulateCropGrowth({
                        crop: primaryCrop,
                        region: user.region,
                        language: languageMap[locale],
                        soilReport: latestSoilReport?.aiSummary,
                    }),
                ]);

                setOutbreakAlert(outbreakResult.alert);
                setYieldPrediction(growthResult.finalYieldPrediction.split(':')[1].split(' vs.')[0].trim());

            } catch (error) {
                console.error("Failed to get dashboard AI predictions:", error);
                setOutbreakAlert(t('dashboard.outbreakError'));
                setYieldPrediction("N/A");
            } finally {
                setLoadingAI(false);
            }
        };
        
        if (user && !soilReportsLoading) {
          getPredictions();
        }
    }, [user, locale, t, primaryCrop, latestSoilReport, soilReportsLoading]);

    const isLoading = loadingAI || soilReportsLoading;

    const summaryCards = [
        { 
            title: t('dashboard.soilFertility'), 
            value: latestSoilReport ? `${latestSoilReport.aiSummary.fertilityIndex}/100` : "N/A", 
            icon: Leaf, 
            details: latestSoilReport ? latestSoilReport.aiSummary.fertilityStatus : (soilReportsLoading ? t('dashboard.loading') : 'No soil report found'),
        },
        { 
            title: t('dashboard.irrigation'), 
            value: "In 3 days", 
            icon: Droplets, 
            details: "Optimal moisture levels" 
        },
        { 
            title: "Predicted Yield",
            value: yieldPrediction ? `${yieldPrediction}` : "...", 
            icon: Target, 
            details: `${primaryCrop} yield per acre`,
        },
        { 
            title: t('dashboard.outbreakAlert'), 
            value: outbreakAlert?.split(' ')[0] || "...", // "High", "No" etc.
            icon: Bug, 
            details: outbreakAlert || t('dashboard.loading') 
        },
    ];
    
    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={`👋 ${t('dashboard.greeting')}, ${user?.name.split(' ')[0]}!`}
                description={user?.farmSize ? `${user?.region} | ${primaryCrop} | ${user.farmSize} acres` : user?.region}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {isLoading ? (
                    [...Array(4)].map((_, i) => <SummaryCard.Skeleton key={i} animationDelay={i * 100} />)
                ) : (
                    summaryCards.map((card, index) => (
                        <SummaryCard 
                            key={card.title}
                            {...card}
                            animationDelay={index * 100}
                        />
                    ))
                )}
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
                                {isLoading ? (
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
