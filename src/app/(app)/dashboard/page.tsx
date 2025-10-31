'use client';
import { PageHeader } from "@/components/page-header"
import { DollarSign, MessageSquare, ShoppingCart } from "lucide-react";
import SummaryCard from "./components/summary-card";
import { MarketChart } from "./components/market-chart";
import { QuickActions } from "./components/quick-actions";
import { useLanguage } from "@/contexts/language-context";

export default function DashboardPage() {
    const { t } = useLanguage();

    const summaryCards = [
        { title: t('dashboard.credits'), value: "250", icon: DollarSign, details: t('dashboard.creditsDetails') },
        { title: t('dashboard.lastAdvisory'), value: "Nitrogen Boost", icon: MessageSquare, details: t('dashboard.lastAdvisoryDate') },
        { title: t('dashboard.marketSnapshot'), value: "+2.5% Wheat", icon: ShoppingCart, details: t('dashboard.marketRegion'), trend: "up" as const },
    ];
    
    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={t('dashboard.title')}
                description={t('dashboard.description')}
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {summaryCards.map((card, index) => (
                    <SummaryCard 
                        key={card.title}
                        {...card}
                        animationDelay={index * 100}
                    />
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <MarketChart />
                </div>
                <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <QuickActions />
                </div>
            </div>
        </div>
    )
}
