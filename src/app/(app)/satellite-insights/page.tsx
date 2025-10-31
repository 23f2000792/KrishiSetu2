'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Map, Droplets, Leaf, Sparkles, AlertTriangle } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from 'next/image';
import { analyzeSatelliteData, SatelliteAnalysisOutput } from '@/ai/flows/satellite-insights-flow';
import { getSatelliteImage } from '@/services/satellite-service';

// Simple markdown to HTML renderer
function MarkdownRenderer({ content }: { content: string }) {
    const renderContent = () => {
        let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\n/g, '<br />');
        return { __html: html };
    };
    return <div className="text-sm prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={renderContent()} />;
}


export default function SatelliteInsightsPage() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'ndvi' | 'rainfall'>('ndvi');
    const [period, setPeriod] = useState<'current' | 'previous'>('current');
    const [analysis, setAnalysis] = useState<SatelliteAnalysisOutput | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            
            setLoading(true);
            setError(null);
            
            try {
                // Fetch analysis and image in parallel
                const [analysisResult, imageResult] = await Promise.all([
                    analyzeSatelliteData({
                        region: user.region,
                        dataType: view,
                        timePeriod: period,
                        language: languageMap[locale],
                    }),
                    getSatelliteImage({
                        region: user.region,
                        dataType: view,
                        timePeriod: period,
                    })
                ]);
                
                setAnalysis(analysisResult);
                setImageUrl(imageResult.imageUrl);

            } catch (e) {
                console.error(e);
                setError("Failed to fetch satellite data and analysis. The AI model or data service may be temporarily unavailable.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, view, period, locale]);

    return (
        <div className="animate-fade-in pb-16 md:pb-0">
            <PageHeader
                title="Satellite Insights"
                description="Monitor your farm's health from above with AI-powered satellite imagery analysis."
            />

            <Card className="w-full">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <CardTitle>Farm Overview: {user?.region}</CardTitle>
                            <CardDescription>Select a data layer and time period to view insights.</CardDescription>
                        </div>
                        <div className='flex gap-2 items-center'>
                             <ToggleGroup type="single" value={period} onValueChange={(value: 'current' | 'previous') => value && setPeriod(value)} aria-label="Time Period">
                                <ToggleGroupItem value="current" aria-label="Current Season">Current</ToggleGroupItem>
                                <ToggleGroupItem value="previous" aria-label="Previous Season">Previous</ToggleGroupItem>
                            </ToggleGroup>
                            <ToggleGroup type="single" value={view} onValueChange={(value: 'ndvi' | 'rainfall') => value && setView(value)} aria-label="Data Layer">
                                <ToggleGroupItem value="ndvi" aria-label="NDVI">
                                    <Leaf className="h-4 w-4 mr-2" />
                                    NDVI
                                </ToggleGroupItem>
                                <ToggleGroupItem value="rainfall" aria-label="Rainfall">
                                    <Droplets className="h-4 w-4 mr-2" />
                                    Rainfall
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-center capitalize">{view} Map - {period} Season</h3>
                            <Card className="aspect-square w-full bg-muted/50">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : error ? (
                                     <div className="flex items-center justify-center h-full text-destructive">
                                        <AlertTriangle className="h-8 w-8" />
                                    </div>
                                ) : (
                                    <div className="relative h-full w-full rounded-lg overflow-hidden border-4 border-primary/20">
                                        <Image src={imageUrl} alt={`${view} map of ${user?.region}`} fill className="object-cover" />
                                    </div>
                                )}
                            </Card>
                        </div>
                         <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-center">AI Analysis &amp; Recommendations</h3>
                            <Card className="aspect-square w-full bg-secondary/30">
                                <CardContent className="p-6 h-full overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center space-y-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                            <p className="text-muted-foreground">Analyzing data...</p>
                                        </div>
                                    </div>
                                ) : error || !analysis ? (
                                     <div className="flex items-center justify-center h-full text-center text-destructive">
                                        <div>
                                            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                                            <p>{error || "Analysis could not be loaded."}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-primary"/> Summary</h4>
                                            <MarkdownRenderer content={analysis.summary} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold flex items-center gap-2"><AlertTriangle size={16} className="text-orange-500"/> Key Observations</h4>
                                            <MarkdownRenderer content={analysis.observations} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold flex items-center gap-2"><Leaf size={16} className="text-green-600"/> Recommended Actions</h4>
                                             <MarkdownRenderer content={analysis.recommendations} />
                                        </div>
                                    </div>
                                )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}