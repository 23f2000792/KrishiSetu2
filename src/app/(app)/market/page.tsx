'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { MarketTable } from "./components/market-table"
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from '@/contexts/auth-context';
import { getMarketDataForCrops } from '@/services/market-service';
import type { MarketPrice } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function MarketPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [data, setData] = useState<MarketPrice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.crops && user.crops.length > 0) {
                setLoading(true);
                const marketData = await getMarketDataForCrops(user.crops, user.region);
                setData(marketData);
                setLoading(false);
            } else {
                setData([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

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
            {loading ? (
                 <Card>
                    <CardContent className="h-96 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            ) : (
                <MarketTable data={data} />
            )}
        </div>
    )
}
