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
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Price trends for key crops (₹ per quintal)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
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
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line dataKey="Wheat" type="monotone" stroke="var(--color-Wheat)" strokeWidth={2} dot={false} />
                <Line dataKey="Rice (Basmati)" type="monotone" stroke="var(--color-Rice (Basmati))" strokeWidth={2} dot={false} />
                <Line dataKey="Cotton" type="monotone" stroke="var(--color-Cotton)" strokeWidth={2} dot={false} />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
