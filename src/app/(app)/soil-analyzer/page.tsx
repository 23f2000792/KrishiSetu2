'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { File, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { analyzeSoilCard } from '@/ai/flows/soil-card-analyzer';
import { extractSoilCardData, ExtractorOutput } from '@/ai/flows/soil-card-extractor';


// Simple markdown to HTML renderer
function MarkdownRenderer({ content }: { content: string }) {
    const renderContent = () => {
        let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace numbered lists
        html = html.replace(/^\s*\d+\.\s(.*)/gm, (match, p1) => `<li>${p1.trim()}</li>`);
        html = html.replace(/(<li>.*<\/li>)/gs, '<ol class="list-decimal list-inside space-y-1 my-2">$1</ol>');
        // Handle cases where lists might be merged by removing nested <ol>
        html = html.replace(/<ol[^>]*>(\s*<li>.*<\/li>\s*)<\/ol>/gs, (match, inner) => {
            return inner;
        });
        html = html.replace(/(<li>.*<\/li>)/gs, '<ol class="list-decimal list-inside space-y-1 my-2">$1</ol>');
        return { __html: html };
    };
    return <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={renderContent()} />;
}


export default function SoilAnalyzerPage() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const toDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
  });

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a soil card file to analyze.',
      });
      return;
    }
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'You must be logged in to analyze a soil card.',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setExtractedData(null);

    try {
      // Step 1: Extract data from the image
      setLoadingStep('Extracting data from image...');
      const dataUri = await toDataURL(selectedFile);
      const extracted = await extractSoilCardData({ photoDataUri: dataUri });
      setExtractedData(extracted);
      
      // Step 2: Get analysis based on extracted data
      setLoadingStep('Analyzing soil parameters...');
      const languageMap = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };
      const result = await analyzeSoilCard({
        ...extracted,
        region: user.region, 
        language: languageMap[locale],
      });
      setAnalysisResult(result);

      // Step 3: Save the complete report to Firestore
      if (firestore) {
        setLoadingStep('Saving report...');
        await addDoc(collection(firestore, 'soil_reports'), {
          userId: user.id,
          uploadedAt: serverTimestamp(),
          fileUrl: `mock-path/${selectedFile.name}`, // In a real app, this would be the Storage URL
          extractedData: extracted,
          aiSummary: result,
        });
        toast({
          title: t('soil.reportSaved'),
          description: t('soil.reportSavedDesc'),
        });
      }

    } catch (e) {
      console.error(e);
      setError(t('soil.error'));
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: t('soil.error'),
      });
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleNewAnalysis = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setExtractedData(null);
    setError(null);
  }

  return (
    <div className="animate-fade-in pb-16 md:pb-0">
      <PageHeader
        title={t('soil.title')}
        description={t('soil.description')}
      />

      {!analysisResult ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('soil.dragOrUpload')}</CardTitle>
            <CardDescription>{t('soil.supportedFormats')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input id="soil-card-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
              <label htmlFor="soil-card-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary">
                <File className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">{selectedFile?.name || 'Click to select a file'}</span>
              </label>
            </div>
            <Button onClick={handleAnalyze} disabled={loading || !selectedFile} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? loadingStep : t('soil.analyzeButton')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-4xl mx-auto animate-fade-in-up">
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <div>
                        <CardTitle>{t('soil.analysisResult')}</CardTitle>
                        <CardDescription>{t('soil.analysisComplete')}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleNewAnalysis}>{t('soil.newAnalysis')}</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base'>{t('soil.fertilityIndex')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-primary">{analysisResult.fertilityIndex}<span className='text-2xl text-muted-foreground'>/100</span></p>
                            <p className="text-sm text-muted-foreground">{analysisResult.fertilityStatus}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                             <CardTitle className='text-base'>{t('soil.phLevel')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{extractedData?.pH}</p>
                            <p className="text-sm text-muted-foreground">Neutral</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                             <CardTitle className='text-base'>{t('soil.npkStatus')}</CardTitle>
                        </CardHeader>
                         <CardContent>
                           <div className="flex justify-around items-center h-full text-foreground">
                                <p className='text-lg'><span className='font-bold'>N:</span> <span className='text-red-600'>{extractedData?.N}</span></p>
                                <p className='text-lg'><span className='font-bold'>P:</span> {extractedData?.P}</p>
                                <p className='text-lg'><span className='font-bold'>K:</span> {extractedData?.K}</p>
                           </div>
                        </CardContent>
                    </Card>
                </div>

                {analysisResult.efficiencyForecast && (
                     <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className='p-2 bg-primary/10 rounded-md'>
                                <TrendingUp className='h-6 w-6 text-primary'/>
                            </div>
                           <div>
                                <h3 className="font-semibold text-base">Efficiency Forecast</h3>
                                <p className="text-sm text-muted-foreground">{analysisResult.efficiencyForecast}</p>
                           </div>
                        </CardContent>
                    </Card>
                )}
                
                 {analysisResult.warnings && analysisResult.warnings.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">{t('soil.warnings')}</h3>
                        <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4 rounded-r-lg">
                            {analysisResult.warnings.map((warn: string) => <p key={warn} className="text-destructive-foreground/90 font-medium flex items-center gap-2"><AlertTriangle size={16} />{warn}</p>)}
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                        <h3 className="font-semibold mb-2">{t('soil.recommendedCrops')}</h3>
                        <div className="bg-secondary/50 p-4 rounded-lg border">
                            <ul className="list-disc list-inside space-y-1">
                                {analysisResult.recommendedCrops.map((crop: string) => <li key={crop}>{crop}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{t('soil.organicAdvice')}</h3>
                        <div className="bg-secondary/50 p-4 rounded-lg border">
                            <MarkdownRenderer content={analysisResult.organicAdvice} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">{t('soil.fertilizerPlan')}</h3>
                     <div className="bg-secondary/50 p-4 rounded-lg border">
                        <MarkdownRenderer content={analysisResult.fertilizerPlan} />
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">{t('soil.aiExplanation')}</h3>
                    <p className="text-sm text-muted-foreground italic p-4 bg-secondary/50 rounded-lg border">"{analysisResult.explanation}"</p>
                </div>

            </CardContent>
        </Card>
      )}

      {error && <p className="text-destructive text-center mt-4">{error}</p>}
    </div>
  );
}
