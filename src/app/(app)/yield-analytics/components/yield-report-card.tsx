'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, BarChart, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { YieldReport } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";

// Simple markdown to HTML renderer
function MarkdownRenderer({ content }: { content: string }) {
    const renderContent = () => {
        let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\n/g, '<br />');
        return { __html: html };
    };
    return <div className="text-sm prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={renderContent()} />;
}


export function YieldReportCard({ report, onNew }: { report: YieldReport, onNew: () => void }) {
    const { t } = useLanguage();
    const isUnderperforming = report.deviation < 0;

    return (
        <Card className="animate-fade-in-up w-full max-w-4xl mx-auto">
            <CardHeader>
                 <div className='flex justify-between items-start'>
                    <div>
                        <CardTitle className="text-2xl font-bold">Yield Analysis Report: {report.crop}</CardTitle>
                        <CardDescription>A comparison of your predicted vs. actual harvest yield.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={onNew}>New Report</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Predicted Yield</p>
                        <p className="text-2xl font-bold">{report.predictedYield.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">quintals/acre</p>
                    </Card>
                    <Card className="p-4 bg-primary/10 border-primary/50">
                        <p className="text-sm text-primary">Actual Yield</p>
                        <p className="text-2xl font-bold text-primary">{report.actualYield.toFixed(1)}</p>
                        <p className="text-xs text-primary/80">quintals/acre</p>
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

                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><BarChart size={20}/> AI-Powered Analysis</h3>
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                         <MarkdownRenderer content={report.analysis} />
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
