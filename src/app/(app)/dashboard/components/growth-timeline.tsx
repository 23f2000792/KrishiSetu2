'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CalendarRange, ShieldCheck, Target, Droplets, Wind, Thermometer, Bug, Sprout } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { simulateCropGrowth, CropGrowthSimulationOutput } from '@/ai/flows/crop-growth-simulation';
import { Skeleton } from '@/components/ui/skeleton';

const stageIcons: { [key: string]: React.ElementType } = {
    default: Sprout,
    germination: Sprout,
    seedling: Sprout,
    vegetative: Sprout,
    flowering: Target,
    fruiting: Target,
    maturity: Target,
};

const riskIcons: { [key: string]: React.ElementType } = {
    default: AlertCircle,
    pest: Bug,
    disease: Bug,
    fungal: Bug,
    aphids: Bug,
    weather: Wind,
    humidity: Droplets,
    heat: Thermometer,
    drought: Thermometer,
};

function getIconFor(type: 'stage' | 'risk', text: string): React.ElementType {
    const lowerText = text.toLowerCase();
    const iconMap = type === 'stage' ? stageIcons : riskIcons;
    
    for (const key in iconMap) {
        if (lowerText.includes(key)) {
            return iconMap[key];
        }
    }
    return iconMap.default;
}

export function GrowthTimeline() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const [simulation, setSimulation] = useState<CropGrowthSimulationOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };

    useEffect(() => {
        const runSimulation = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const result = await simulateCropGrowth({
                    crop: 'Wheat', // This would be dynamic in a real app
                    region: user.region,
                    language: languageMap[locale],
                    // In a real app, you'd fetch the latest soil report here
                    soilReport: { pH: 6.8, N: "Medium", P: "High", K: "Medium", OC: 0.6 },
                });
                setSimulation(result);
            } catch (error) {
                console.error("Failed to run growth simulation:", error);
            } finally {
                setLoading(false);
            }
        };
        runSimulation();
    }, [user, locale]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                     <Skeleton className="h-6 w-full mt-4" />
                </CardContent>
            </Card>
        )
    }

    if (!simulation) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>30-Day Growth Forecast: Wheat</CardTitle>
                <CardDescription>An AI-powered simulation of your crop's journey for the next month.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6 space-y-8 border-l-2 border-dashed border-primary/50">
                    {simulation.timeline.map((week, index) => {
                        const StageIcon = getIconFor('stage', week.growthStage);
                        const RiskIcon = getIconFor('risk', week.predictedRisks);

                        return (
                        <div key={week.week} className="relative">
                            <div className="absolute -left-[38px] top-1 flex items-center justify-center bg-primary h-12 w-12 rounded-full border-4 border-background">
                                <StageIcon className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="ml-6">
                                <p className="font-semibold text-primary">Week {week.week}: {week.growthStage}</p>
                                
                                <div className="mt-2 flex items-start gap-3 p-3 bg-secondary/50 rounded-md border">
                                    <RiskIcon className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-destructive">Potential Risks</p>
                                        <p className="text-sm text-muted-foreground">{week.predictedRisks}</p>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-start gap-3 p-3 bg-secondary/50 rounded-md border">
                                    <ShieldCheck className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Recommended Actions</p>
                                        <p className="text-sm text-muted-foreground">{week.recommendedActions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>

                <div className='mt-6 p-4 bg-primary/10 rounded-lg text-center border border-primary/20'>
                    <p className='font-semibold text-primary'>{simulation.finalYieldPrediction}</p>
                </div>
            </CardContent>
        </Card>
    );
}
