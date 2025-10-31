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

const chartData = marketPrices.reduce((acc, crop) => {
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

const chartConfig = {
  'Wheat': {
    label: 'Wheat',
    color: 'hsl(var(--chart-1))',
  },
  'Rice (Basmati)': {
    label: 'Rice (Basmati)',
    color: 'hsl(var(--chart-2))',
  },
  'Cotton': {
    label: 'Cotton',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function MarketChart() {
  const { t } = useLanguage();
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
                    <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-Wheat)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-Wheat)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCotton" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-Cotton)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-Cotton)" stopOpacity={0.1}/>
                    </linearGradient>
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
                <Area dataKey="Wheat" type="monotone" stroke="var(--color-Wheat)" fill="url(#colorWheat)" strokeWidth={2} dot={false} />
                <Area dataKey="Cotton" type="monotone" stroke="var(--color-Cotton)" fill="url(#colorCotton)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
