'use client';
import { PageHeader } from "@/components/page-header"
import { Bot, Droplets, Leaf, LineChart, MessageSquare, ShoppingCart, Tractor } from "lucide-react";
import SummaryCard from "./components/summary-card";
import { MarketChart } from "./components/market-chart";
import { QuickActions } from "./components/quick-actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
    const { t } = useLanguage();
    const { user } = useAuth();

    const summaryCards = [
        { title: t('dashboard.soilFertility'), value: "82/100", icon: Leaf, details: t('dashboard.healthy'), trend: "up" as const, change: "+5%" },
        { title: t('dashboard.irrigation'), value: "In 2 days", icon: Droplets, details: t('dashboard.soilMoisture') },
        { title: t('dashboard.mandiForecast'), value: "+4.3%", icon: LineChart, details: t('dashboard.wheatPrice'), trend: "up" as const },
        { title: t('dashboard.aiAdvisory'), value: "Apply NPK", icon: Bot, details: t('dashboard.copilotSuggestion') },
    ];
    
    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={`👋 ${t('dashboard.greeting')}, ${user?.name.split(' ')[0]}!`}
                description={`${user?.region} | Wheat | 4.2 acres`}
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

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <MarketChart />
                </div>
                <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <QuickActions />
                </div>
            </div>
        </div>
    )
}
