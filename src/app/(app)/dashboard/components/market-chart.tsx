'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useLanguage } from "@/contexts/language-context";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getMarketDataForCrops } from "@/services/market-service";
import type { MarketPrice } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const availableChartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

export function MarketChart({ crops: selectedCrops }: { crops?: string[] }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [marketData, setMarketData] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !selectedCrops || selectedCrops.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getMarketDataForCrops(selectedCrops, user.region);
      setMarketData(data);
      setLoading(false);
    };
    fetchData();
  }, [selectedCrops, user]);

  const { chartData, chartConfig, enabledCrops } = useMemo(() => {
    const enabledCrops = marketData.length > 0 ? marketData : [];

    const chartConfig: ChartConfig = {};
    enabledCrops.forEach((crop, index) => {
        chartConfig[crop.crop] = {
            label: crop.crop,
            color: availableChartColors[index % availableChartColors.length],
        };
    });

    const allDates = new Set<string>();
    enabledCrops.forEach(crop => {
        crop.prices.forEach(p => allDates.add(p.date));
    });

    const sortedDates = Array.from(allDates).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

    const chartData = sortedDates.map(date => {
        const entry: { [key: string]: any } = { date };
        enabledCrops.forEach(crop => {
            const pricePoint = crop.prices.find(p => p.date === date);
            entry[crop.crop] = pricePoint ? pricePoint.price : null;
        });
        return entry;
    });

    return { chartData, chartConfig, enabledCrops };
  }, [marketData]);

  if (loading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-60 w-full" />
              </CardContent>
          </Card>
      )
  }

  if (!loading && enabledCrops.length === 0) {
    return (
        <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
                <CardTitle>{t('dashboard.marketChartTitle')}</CardTitle>
                <CardDescription>{t('dashboard.marketChartDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">Please select crops in your profile to see market trends.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle>{t('dashboard.marketChartTitle')}</CardTitle>
        <CardDescription>{t('dashboard.marketChartDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 w-full">
            <AreaChart 
                data={chartData} 
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
                <defs>
                   {enabledCrops.map(crop => (
                     <linearGradient key={crop.crop} id={`color${crop.crop.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`var(--color-${crop.crop})`} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={`var(--color-${crop.crop})`} stopOpacity={0.1}/>
                    </linearGradient>
                   ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                {enabledCrops.map(crop => (
                    <Area 
                        key={crop.crop} 
                        dataKey={crop.crop} 
                        type="monotone" 
                        stroke={`var(--color-${crop.crop})`} 
                        fill={`url(#color${crop.crop.replace(/[^a-zA-Z0-9]/g, '')})`} 
                        strokeWidth={2} 
                        dot={false}
                        connectNulls
                    />
                ))}
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
