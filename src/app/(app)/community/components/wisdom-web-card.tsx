'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2, Search, UserCheck, Check } from "lucide-react";
import { generateCommunityInsights, CommunityInsightsOutput } from '@/ai/flows/community-insights-flow';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { Input } from '@/components/ui/input';

const TOPICS = [
    "Paddy Leaf Blast",
    "Wheat Yellow Rust",
    "Cotton Bollworm",
    "Maize Irrigation",
    "Sugarcane Fertilizer",
];

function InsightsResult({ result }: { result: CommunityInsightsOutput }) {
    if (!result) return null;

    return (
        <div className="mt-4 space-y-4 animate-fade-in-up">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                    <UserCheck className="h-6 w-6 text-primary" />
                    <div>
                        <p className="font-bold text-xl text-primary">{result.totalFarmers} Farmers Discussed This</p>
                        <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Top Community Solutions</h3>
                <ul className="space-y-3">
                    {result.topSolutions.map((solution, index) => (
                        <li key={index} className="p-3 bg-secondary rounded-md border flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm">{solution.solution}</p>
                                <p className="text-xs text-muted-foreground font-medium">{solution.farmerCount} farmers agree</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export function WisdomWebCard() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CommunityInsightsOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
    
    const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };

    const handleAnalyze = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const insights = await generateCommunityInsights({
                topic: selectedTopic,
                region: user.region,
                language: languageMap[locale],
            });
            setResult(insights);
        } catch (e) {
            console.error(e);
            setError("Failed to generate insights. The AI model might be unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-8 border-2 border-primary/50 bg-gradient-to-br from-card to-secondary/30 shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 w-fit">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">Community Wisdom Web</CardTitle>
                        <CardDescription>Get AI-powered summaries of community discussions.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative w-full">
                             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                list="topics" 
                                placeholder="e.g., Paddy Leaf Blast" 
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                className="pl-8"
                            />
                            <datalist id="topics">
                                {TOPICS.map(topic => <option key={topic} value={topic} />)}
                            </datalist>
                        </div>
                        <Button onClick={handleAnalyze} disabled={loading || !selectedTopic} className="w-full sm:w-auto">
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="mr-2 h-4 w-4" />
                            )}
                            Analyze Topic
                        </Button>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {error && <p className="text-destructive text-center">{error}</p>}
                    
                    {result && <InsightsResult result={result} />}
                </div>
            </CardContent>
        </Card>
    );
}
