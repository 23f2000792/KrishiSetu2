'use client';
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { MarketTable } from "./components/market-table"
import { marketPrices } from "@/lib/data"
import { useLanguage } from "@/contexts/language-context";

export default function MarketPage() {
    const { t } = useLanguage();
    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={t('market.title')}
                description={t('market.description')}
            >
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    {t('market.exportData')}
                </Button>
            </PageHeader>
            <MarketTable initialData={marketPrices} />
        </div>
    )
}
