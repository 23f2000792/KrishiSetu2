'use client';
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { FileUploader } from "./components/file-uploader";
import { ScanResult as ScanResultType } from "@/lib/types";
import { ScanResultCard } from "./components/scan-result";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { diagnoseCrop } from '@/ai/flows/crop-disease-nutrient-prediction';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CameraView } from "./components/camera-view";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";

export default function ScannerPage() {
    const [result, setResult] = useState<ScanResultType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const { t, locale } = useLanguage();
    const { user } = useAuth();

    const languageMap = {
      en: 'English',
      hi: 'Hindi',
      pa: 'Punjabi',
    };

    const toDataURL = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
    });

    const handleScan = async (data: File | string) => {
        if (!user) {
            setError(t('scanner.error'));
            return;
        }
        setLoading(true);
        setResult(null);
        setError(null);
        setIsCameraOpen(false);

        try {
            const dataUri = typeof data === 'string' ? data : await toDataURL(data);
            const aiResult = await diagnoseCrop({ photoDataUri: dataUri, language: languageMap[locale] });
            setResult({
                id: `scan-${Date.now()}`,
                userId: user.id,
                imageUrl: dataUri,
                ...aiResult,
                createdAt: new Date().toISOString(),
            });
        } catch (e) {
            console.error(e);
            setError(t('scanner.error'));
        } finally {
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        setResult(null);
        setError(null);
    }

    return (
        <div className="pb-16 md:pb-0">
             {isCameraOpen && <CameraView onCapture={handleScan} onClose={() => setIsCameraOpen(false)} />}
            <div className="flex flex-col items-center gap-8 h-full">
                <PageHeader
                    title={t('scanner.title')}
                    description={t('scanner.description')}
                    className="w-full max-w-2xl mx-auto"
                />
                <div className="flex-grow animate-fade-in-up w-full">
                    {loading ? (
                         <Card className="w-full max-w-2xl mx-auto">
                            <CardHeader className="items-center">
                              <Skeleton className="h-8 w-1/2" />
                              <Skeleton className="h-4 w-3/4" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <Skeleton className="aspect-video w-full rounded-xl" />
                              <div className="space-y-6">
                                  <div className="space-y-2">
                                      <Skeleton className="h-6 w-1/4" />
                                      <Skeleton className="h-10 w-full" />
                                  </div>
                                  <div className="space-y-2">
                                       <Skeleton className="h-6 w-1/3" />
                                       <Skeleton className="h-24 w-full" />
                                  </div>
                              </div>
                            </CardContent>
                        </Card>
                    ) : result ? (
                        <ScanResultCard result={result} onNewScan={handleReset} />
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <FileUploader onFileUpload={handleScan} onCameraOpen={() => setIsCameraOpen(true)} />
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive" className="mt-4 max-w-2xl mx-auto">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
