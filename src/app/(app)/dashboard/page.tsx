import { PageHeader } from "@/components/page-header"
import { DollarSign, MessageSquare, ShoppingCart } from "lucide-react";
import SummaryCard from "./components/summary-card";
import { MarketChart } from "./components/market-chart";
import { QuickActions } from "./components/quick-actions";

export default function DashboardPage() {
    return (
        <div className="pb-16 md:pb-0">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's a snapshot of your farm."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <SummaryCard title="Credits" value="250" icon={DollarSign} details="Available for AI services"/>
                <SummaryCard title="Last Advisory" value="Nitrogen Boost" icon={MessageSquare} details="2 days ago" />
                <SummaryCard title="Market Snapshot" value="+2.5% Wheat" icon={ShoppingCart} details="Punjab Region" trend="up" />
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    <MarketChart />
                </div>
                <div className="lg:col-span-2">
                    <QuickActions />
                </div>
            </div>
        </div>
    )
}
