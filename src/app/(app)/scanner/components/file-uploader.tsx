'use client';
import { useRef, useState, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

type FileUploaderProps = {
  onFileUpload: (file: File) => void;
  onCameraOpen: () => void;
};

export function FileUploader({ onFileUpload, onCameraOpen }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };


  return (
    <Card 
        className={`border-2 border-dashed transition-all duration-300 transform-gpu ${isDragging ? 'border-primary bg-primary/10 scale-105 shadow-2xl' : 'border-border hover:border-primary/50 hover:shadow-lg'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      <CardContent className="p-6 md:p-12">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit transition-transform duration-300 group-hover:scale-110">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl font-headline font-semibold">
            {t('scanner.dragOrUpload')}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            {t('scanner.supportedFormats')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => inputRef.current?.click()} className="w-full sm:w-auto">
              {t('scanner.browseFiles')}
            </Button>
            <Input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
            <Button size="lg" variant="outline" onClick={onCameraOpen} className="w-full sm:w-auto">
              <Camera className="mr-2 h-4 w-4" />
              {t('scanner.useCamera')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
