'use client';
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { FileUploader } from "./components/file-uploader";
import { ScanResult as ScanResultType } from "@/lib/types";
import { ScanResultCard } from "./components/scan-result";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { scannerResults as pastScans } from "@/lib/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { diagnoseCrop } from '@/ai/flows/crop-disease-nutrient-prediction';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CameraView } from "./components/camera-view";
import { useLanguage } from "@/contexts/language-context";

export default function ScannerPage() {
    const [result, setResult] = useState<ScanResultType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const { t } = useLanguage();

    const toDataURL = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
    });

    const handleScan = async (data: File | string) => {
        setLoading(true);
        setResult(null);
        setError(null);
        setIsCameraOpen(false);

        try {
            const dataUri = typeof data === 'string' ? data : await toDataURL(data);
            const aiResult = await diagnoseCrop({ photoDataUri: dataUri });
            setResult({
                id: `scan-${Date.now()}`,
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
            <div className="grid lg:grid-cols-3 gap-8 items-start h-full">
                <div className="lg:col-span-2 flex flex-col gap-8 h-full">
                    <PageHeader
                        title={t('scanner.title')}
                        description={t('scanner.description')}
                    />
                    <div className="flex-grow animate-fade-in-up">
                        {loading ? (
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/2" />
                                    <Skeleton className="h-4 w-3/4" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-48 w-full" />
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                        ) : result ? (
                            <ScanResultCard result={result} onNewScan={handleReset} />
                        ) : (
                            <FileUploader onFileUpload={handleScan} onCameraOpen={() => setIsCameraOpen(true)} />
                        )}
                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                <Card className="hidden lg:flex lg:flex-col h-full sticky top-24">
                    <CardHeader>
                        <CardTitle>Past Scans</CardTitle>
                        <CardDescription>Review your previous scan history.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-270px)] pr-4">
                            <div className="space-y-4">
                                {pastScans.map(scan => (
                                    <div key={scan.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0">
                                            <Image src={scan.imageUrl} alt={scan.prediction} fill className="object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm">{scan.prediction}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(scan.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setResult(scan)}>View</Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
