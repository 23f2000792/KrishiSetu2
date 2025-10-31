'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { planCrop, CropPlannerOutput } from '@/ai/flows/crop-planner-flow';

function CropPlanResult({ result }: { result: CropPlannerOutput }) {
    const { t } = useLanguage();

    // Simple markdown to HTML renderer
    const MarkdownRenderer = ({ content }: { content: string }) => {
        // Convert markdown bold to strong tags and newlines to br tags
        const html = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
        return <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
        <Card className="animate-fade-in-up">
            <CardHeader>
                <CardTitle>AI Crop Recommendation</CardTitle>
                <CardDescription>Based on your farm's data and market forecasts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="bg-primary/10 border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-primary">{result.recommendedCrop}</CardTitle>
                        <CardDescription>Is the most profitable choice for the upcoming season.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{result.expectedRoi}</p>
                        <p className="text-sm text-muted-foreground">Expected Return on Investment</p>
                    </CardContent>
                </Card>
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb size={20} /> AI Justification</h3>
                    <div className="p-4 bg-secondary/50 rounded-lg border space-y-2">
                        <MarkdownRenderer content={result.justification} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function CropPlannerPage() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CropPlannerOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePlan = async () => {
        if (!user) return;
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };
            const plan = await planCrop({ userId: user.id, region: user.region, language: languageMap[locale] });
            setResult(plan);
        } catch (e) {
            console.error(e);
            setError("Failed to generate a crop plan. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in pb-16 md:pb-0">
            <PageHeader
                title="AI Crop Planner"
                description="Get an AI-powered recommendation for your next planting season."
            />
            <div className="max-w-2xl mx-auto">
                {!result ? (
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                                <Wand2 className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>Ready to Plan Your Next Season?</CardTitle>
                            <CardDescription>Our AI will analyze your soil health, local weather forecasts, and market demand to suggest the most profitable crop for you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handlePlan} disabled={loading} size="lg">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Plan...
                                    </>
                                ) : (
                                    "Generate My Crop Plan"
                                )}
                            </Button>
                            {error && <p className="text-destructive text-sm mt-4">{error}</p>}
                        </CardContent>
                    </Card>
                ) : (
                    <CropPlanResult result={result} />
                )}
            </div>
        </div>
    );
}
