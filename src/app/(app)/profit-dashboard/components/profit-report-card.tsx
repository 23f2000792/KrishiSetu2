'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ProfitReport } from "@/lib/types";
import { useMemo } from "react";

const COLORS = ['#0F9D58', '#F6A623', '#4285F4', '#DB4437', '#AB47BC', '#FF7043', '#26A69A'];

function formatCurrency(value: number) {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function ProfitReportCard({ report, onNew }: { report: ProfitReport; onNew: () => void }) {
    
    const costBreakdown = useMemo(() => {
        return Object.entries(report.costs).map(([name, value]) => ({
            name: name.replace('Cost', ''),
            value
        })).filter(item => item.value > 0);
    }, [report.costs]);

    return (
        <Card className="animate-fade-in-up w-full max-w-4xl mx-auto">
            <CardHeader>
                <div className='flex justify-between items-start'>
                    <div>
                        <CardTitle className="text-2xl font-bold">Profitability Report: {report.crop}</CardTitle>
                        <CardDescription>An analysis of your revenue and expenses.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={onNew}>New Report</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <Card className="p-4 bg-red-500/10">
                        <p className="text-sm text-red-700">Total Cost</p>
                        <p className="text-2xl font-bold">{formatCurrency(report.results.totalCost)}</p>
                    </Card>
                     <Card className="p-4 bg-green-500/10">
                        <p className="text-sm text-green-700">Total Revenue</p>
                        <p className="text-2xl font-bold">{formatCurrency(report.results.totalRevenue)}</p>
                    </Card>
                     <Card className="p-4 bg-blue-500/10">
                        <p className="text-sm text-blue-700">Net Profit</p>
                        <p className="text-2xl font-bold">{formatCurrency(report.results.netProfit)}</p>
                    </Card>
                     <Card className="p-4 bg-primary/10">
                        <p className="text-sm text-primary">Return on Investment</p>
                        <p className="text-2xl font-bold">{report.results.roi.toFixed(1)}%</p>
                    </Card>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-center mb-4">Cost Breakdown</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={costBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {costBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
