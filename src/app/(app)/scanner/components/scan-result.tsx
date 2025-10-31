import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanResult } from '@/lib/types';
import { CheckCircle, Save, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

type ScanResultCardProps = {
  result: ScanResult;
};

export function ScanResultCard({ result }: ScanResultCardProps) {
    const isHealthy = result.prediction.toLowerCase().includes('healthy');
    const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">Scan Result</CardTitle>
                <CardDescription>Analysis complete for your uploaded image.</CardDescription>
            </div>
            <Badge variant={isHealthy ? 'default' : 'destructive'} className={isHealthy ? 'bg-green-500' : 'bg-red-500'}>
                {isHealthy ? <CheckCircle className="mr-2 h-4 w-4" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                {result.prediction}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="relative aspect-video rounded-lg overflow-hidden border">
          <Image src={result.imageUrl} alt="Scanned leaf" fill className="object-contain" />
        </div>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold">Confidence Score</h3>
                <div className="flex items-center gap-2 mt-1">
                    <Progress value={confidencePercentage} className="w-full" />
                    <span className="font-bold text-sm">{confidencePercentage}%</span>
                </div>
            </div>
            <div>
                <h3 className="font-semibold">Recommended Steps</h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{result.recommendedSteps}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>
            <Save className="mr-2 h-4 w-4" />
            Save to Records
        </Button>
      </CardFooter>
    </Card>
  );
}
