
'use client';
import { PageHeader } from "@/components/page-header"
import { Droplets, Leaf, ShoppingBasket, Target, CalendarRange } from "lucide-react";
import SummaryCard from "./components/summary-card";
import { MarketChart } from "./components/market-chart";
import { QuickActions } from "./components/quick-actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { SoilReport } from "@/lib/types";
import { useUserCollection } from "@/firebase/firestore/use-user-collection";
import { getMarketData } from "@/services/market-service";


export default function DashboardPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    
    // State
    const [soilFertility, setSoilFertility] = useState<{value: string, details: string} | null>(null);
    const [latestPrice, setLatestPrice] = useState<number | null>(null);

    // Loading State
    const [loadingMarket, setLoadingMarket] = useState(true);

    const { data: soilReports, isLoading: soilReportsLoading } = useUserCollection<SoilReport>('soil_reports');

    const latestSoilReport = useMemo(() => {
        if (!soilReports || soilReports.length === 0) return null;
        return [...soilReports].sort((a, b) => b.uploadedAt.toDate().getTime() - a.uploadedAt.toDate().getTime())[0];
    }, [soilReports]);
    
    const primaryCrop = useMemo(() => user?.crops?.[0] || 'Wheat', [user?.crops]);

    useEffect(() => {
        if (user && !soilReportsLoading) {
            setSoilFertility({
                value: latestSoilReport ? `${latestSoilReport.aiSummary.fertilityIndex}/100` : "N/A",
                details: latestSoilReport ? latestSoilReport.aiSummary.fertilityStatus : t('dashboard.loading')
            });
        }
    }, [user, soilReportsLoading, latestSoilReport, t]);


    useEffect(() => {
        if (!user?.farmSize) {
            setLoadingMarket(false);
            return;
        }

        const getMarketPrice = async () => {
            setLoadingMarket(true);
            try {
                const marketResult = await getMarketData(primaryCrop, user.region);
                setLatestPrice(marketResult?.latestPrice || null);
            } catch (error) {
                console.error("Failed to get dashboard market price:", error);
                setLatestPrice(null);
            } finally {
                setLoadingMarket(false);
            }
        };
        
        getMarketPrice();
    }, [user, primaryCrop]);

    const isLoading = loadingMarket || soilReportsLoading;

    const summaryCards = [
        { 
            title: t('dashboard.soilFertility'), 
            value: soilFertility?.value ?? "...", 
            icon: Leaf, 
            details: soilFertility?.details ?? t('dashboard.loading'),
        },
        { 
            title: t('dashboard.irrigation'), 
            value: "In 3 days", 
            icon: Droplets, 
            details: "Optimal moisture levels" 
        },
        { 
            title: t('dashboard.predictedYield'),
            value: "Forecast", 
            icon: Target, 
            details: `View 30-day forecast`,
        },
        { 
            title: t('dashboard.mandiPrice'), 
            value: latestPrice ? `₹${latestPrice.toLocaleString()}`: "...",
            icon: ShoppingBasket, 
            details: `Latest price for ${primaryCrop}`
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
                        card.title === t('dashboard.predictedYield') ? (
                             <Link href="/growth-forecast" key={card.title}>
                                <SummaryCard 
                                    {...card}
                                    animationDelay={index * 100}
                                />
                             </Link>
                        ) : (
                            <SummaryCard 
                                key={card.title}
                                {...card}
                                animationDelay={index * 100}
                            />
                        )
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
                                <p className="text-muted-foreground mt-1">AI-powered simulation of your crop's upcoming growth cycle, including yield prediction.</p>
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
