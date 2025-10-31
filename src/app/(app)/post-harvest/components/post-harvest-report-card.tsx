
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, BarChart, Download, Share2, PieChart as PieChartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostHarvestReport } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMemo } from "react";

const COLORS = ['#0F9D58', '#F6A623', '#4285F4', '#DB4437', '#AB47BC', '#FF7043', '#26A69A'];

function formatCurrency(value: number) {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

// Simple markdown to HTML renderer
function MarkdownRenderer({ content }: { content: string }) {
    const renderContent = () => {
        let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\n/g, '<br />');
        return { __html: html };
    };
    return <div className="text-sm prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={renderContent()} />;
}


export function PostHarvestReportCard({ report, onNew }: { report: PostHarvestReport, onNew: () => void }) {
    const { t } = useLanguage();
    const isUnderperforming = report.deviation < 0;

    const costBreakdown = useMemo(() => {
        return Object.entries(report.costs).map(([name, value]) => ({
            name: name.replace(/([A-Z])/g, ' $1').replace('Cost', ' Cost').trim(),
            value
        })).filter(item => item.value > 0);
    }, [report.costs]);

    return (
        <Card className="animate-fade-in-up w-full max-w-4xl mx-auto">
            <CardHeader>
                 <div className='flex justify-between items-start'>
                    <div>
                        <CardTitle className="text-2xl font-bold">Post-Harvest Report: {report.crop}</CardTitle>
                        <CardDescription>A complete analysis of your yield and profitability.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={onNew}>New Report</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Profit Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <Card className="p-4 bg-green-500/10">
                        <p className="text-sm text-green-700">Total Revenue</p>
                        <p className="text-2xl font-bold">{formatCurrency(report.results.totalRevenue)}</p>
                    </Card>
                    <Card className="p-4 bg-red-500/10">
                        <p className="text-sm text-red-700">Total Cost</p>
                        <p className="text-2xl font-bold">{formatCurrency(report.results.totalCost)}</p>
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

                {/* Yield Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Predicted Yield</p>
                        <p className="text-2xl font-bold">{report.predictedYield.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">quintals/acre</p>
                    </Card>
                    <Card className="p-4 bg-secondary">
                        <p className="text-sm text-foreground">Actual Yield</p>
                        <p className="text-2xl font-bold text-primary">{report.actualYield.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">quintals/acre</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Deviation</p>
                        <div className={cn(
                            "text-2xl font-bold flex items-center justify-center gap-1",
                            isUnderperforming ? "text-destructive" : "text-green-600"
                        )}>
                            {isUnderperforming ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                            {report.deviation.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">from prediction</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><BarChart size={20}/> Yield Deviation Analysis</h3>
                        <div className="p-4 bg-secondary/50 rounded-lg border h-full">
                             <MarkdownRenderer content={report.analysis} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-center"><PieChartIcon size={20}/> Cost Breakdown</h3>
                        <div className="h-64 w-full p-4 bg-secondary/50 rounded-lg border">
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
                </div>

                 <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Export as PDF
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Report
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
