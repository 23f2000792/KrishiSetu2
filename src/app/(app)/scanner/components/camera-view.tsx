'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Zap, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/language-context';

type CameraViewProps = {
  onCapture: (dataUri: string) => void;
  onClose: () => void;
};

export function CameraView({ onCapture, onClose }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
            variant: 'destructive',
            title: t('scanner.cameraNotSupportedTitle'),
            description: t('scanner.cameraNotSupportedDesc'),
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('scanner.cameraAccessDeniedTitle'),
          description: t('scanner.cameraAccessDeniedDesc'),
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast, t]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        onCapture(dataUri);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-2xl aspect-[9/16] md:aspect-video bg-muted rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/50 flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

             {!hasCameraPermission && (
                <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80'>
                    <Alert variant="destructive" className='max-w-sm'>
                        <ImageIcon className="h-4 w-4" />
                        <AlertTitle>{t('scanner.cameraViewTitle')}</AlertTitle>
                        <AlertDescription>
                            {t('scanner.cameraViewDescription')}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            
            <div className="absolute top-4 left-4 right-4 flex justify-between">
                <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white" onClick={onClose}>
                    <X />
                </Button>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <Button size="icon" className="rounded-full w-20 h-20 bg-background/80 border-4 border-primary hover:bg-background" onClick={handleCapture} disabled={!hasCameraPermission}>
                    <Camera className="h-8 w-8 text-primary" />
                </Button>
            </div>
        </div>
    </div>
  );
}
