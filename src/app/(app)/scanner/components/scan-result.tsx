'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanResult } from '@/lib/types';
import { CheckCircle, Save, AlertTriangle, Scan } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

type ScanResultCardProps = {
  result: ScanResult;
  onNewScan: () => void;
};

export function ScanResultCard({ result, onNewScan }: ScanResultCardProps) {
    const isHealthy = result.prediction.toLowerCase().includes('healthy');
    const confidencePercentage = Math.round(result.confidence * 100);
    const { t } = useLanguage();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{t('scanner.scanResult')}</CardTitle>
                <CardDescription>{t('scanner.analysisComplete')}</CardDescription>
            </div>
            <Badge variant={isHealthy ? 'default' : 'destructive'} className={`${isHealthy ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                {isHealthy ? <CheckCircle className="mr-2 h-4 w-4" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                {result.prediction}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-primary/50">
          <Image src={result.imageUrl} alt="Scanned leaf" fill className="object-contain" />
        </div>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold">{t('scanner.confidence')}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <Progress value={confidencePercentage} className="w-full" />
                    <span className="font-bold text-sm">{confidencePercentage}%</span>
                </div>
            </div>
            <div>
                <h3 className="font-semibold">{t('scanner.recommendations')}</h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{result.recommendedSteps}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={onNewScan}>
            <Scan className="mr-2 h-4 w-4" />
            {t('scanner.scanAnother')}
        </Button>
        <Button>
            <Save className="mr-2 h-4 w-4" />
            {t('scanner.saveToRecords')}
        </Button>
      </CardFooter>
    </Card>
  );
}
