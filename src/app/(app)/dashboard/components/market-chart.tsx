'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { marketPrices } from "@/lib/data";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useLanguage } from "@/contexts/language-context";
import { useMemo } from "react";

const availableChartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

export function MarketChart({ crops }: { crops?: string[] }) {
  const { t } = useLanguage();

  const { chartData, chartConfig, enabledCrops } = useMemo(() => {
    const enabledCrops = crops && crops.length > 0
        ? marketPrices.filter(mp => crops.includes(mp.crop))
        : marketPrices.slice(0, 2); // Default to first 2 if no crops are selected

    const chartConfig: ChartConfig = {};
    enabledCrops.forEach((crop, index) => {
        chartConfig[crop.crop] = {
            label: crop.crop,
            color: availableChartColors[index % availableChartColors.length],
        };
    });

    const chartData = enabledCrops.reduce((acc, crop) => {
        crop.prices.forEach(pricePoint => {
            let entry = acc.find(item => item.date === pricePoint.date);
            if (!entry) {
                entry = { date: pricePoint.date };
                acc.push(entry);
            }
            (entry as any)[crop.crop] = pricePoint.price;
        });
        return acc;
    }, [] as any[]);

    chartData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { chartData, chartConfig, enabledCrops };
  }, [crops]);

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
                    />
                ))}
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
