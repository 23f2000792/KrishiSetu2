'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanResult } from '@/lib/types';
import { CheckCircle, Save, AlertTriangle, Scan, Bot } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { useState, useEffect } from 'react';

type ScanResultCardProps = {
  result: ScanResult;
  onNewScan: () => void;
};

export function ScanResultCard({ result, onNewScan }: ScanResultCardProps) {
    const isHealthy = result.prediction.toLowerCase().includes('healthy');
    const [confidence, setConfidence] = useState(0);
    const { t } = useLanguage();

    useEffect(() => {
        const timer = setTimeout(() => setConfidence(Math.round(result.confidence * 100)), 300);
        return () => clearTimeout(timer);
    }, [result.confidence]);

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle className="font-headline text-2xl">{t('scanner.scanResult')}</CardTitle>
                <CardDescription>{t('scanner.analysisComplete')}</CardDescription>
            </div>
            <Badge variant={isHealthy ? 'default' : 'destructive'} className={`${isHealthy ? 'bg-green-600' : 'bg-red-600'} text-white text-base py-1 px-3`}>
                {isHealthy ? <CheckCircle className="mr-2 h-4 w-4" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                {result.prediction}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-xl overflow-hidden border-4 border-primary/50 shadow-lg animate-fade-in-right">
          <Image src={result.imageUrl} alt="Scanned leaf" fill className="object-contain" />
        </div>
        <div className="space-y-6 animate-fade-in-left" style={{ animationDelay: '200ms' }}>
            <div>
                <h3 className="font-semibold text-lg">{t('scanner.confidence')}</h3>
                <div className="flex items-center gap-4 mt-2">
                    <Progress value={confidence} className="w-full h-3" />
                    <span className="font-bold text-lg text-primary">{confidence}%</span>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg">{t('scanner.recommendations')}</h3>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap bg-secondary/50 p-4 rounded-md border">{result.recommendedSteps}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row justify-between gap-4">
        <Button>
            <Bot className="mr-2 h-4 w-4" />
            Ask AI Copilot for more details
        </Button>
        <div className='flex gap-2'>
            <Button variant="outline" onClick={onNewScan}>
                <Scan className="mr-2 h-4 w-4" />
                {t('scanner.scanAnother')}
            </Button>
            <Button>
                <Save className="mr-2 h-4 w-4" />
                {t('scanner.saveToRecords')}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
