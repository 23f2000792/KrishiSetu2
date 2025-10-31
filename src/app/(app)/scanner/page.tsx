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
import { diagnoseLeaf } from '@/ai/flows/leaf-disease-nutrient-prediction';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ScannerPage() {
    const [result, setResult] = useState<ScanResultType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toDataURL = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
    });

    const handleScan = async (file: File) => {
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const dataUri = await toDataURL(file);
            const aiResult = await diagnoseLeaf({ photoDataUri: dataUri });
            setResult({
                id: `scan-${Date.now()}`,
                imageUrl: dataUri,
                ...aiResult,
                createdAt: new Date().toISOString(),
            });
        } catch (e) {
            console.error(e);
            setError("Failed to analyze the image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start h-[calc(100vh-140px)] md:h-[calc(100vh-113px)] pb-16 md:pb-0">
            <div className="lg:col-span-2 flex flex-col gap-8 h-full">
                <PageHeader
                    title="Leaf Scanner"
                    description="Upload a photo of a leaf to detect diseases or nutrient deficiencies."
                />
                 <div className="flex-grow">
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
                        <ScanResultCard result={result} />
                    ) : (
                        <FileUploader onFileUpload={handleScan} />
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

            <Card className="hidden lg:flex lg:flex-col h-full">
                <CardHeader>
                    <CardTitle>Past Scans</CardTitle>
                    <CardDescription>Review your previous scan history.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full pr-4">
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
    );
}
