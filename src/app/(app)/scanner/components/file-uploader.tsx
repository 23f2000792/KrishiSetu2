'use client';
import { useRef, useState, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Camera } from 'lucide-react';

type FileUploaderProps = {
  onFileUpload: (file: File) => void;
  onCameraOpen: () => void;
};

export function FileUploader({ onFileUpload, onCameraOpen }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };


  return (
    <Card 
        className={`border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-border'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold font-headline">
            Drag & Drop or Upload a Photo
          </h3>
          <p className="text-muted-foreground">
            Supported formats: PNG, JPG, JPEG. Max file size: 5MB.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => inputRef.current?.click()}>
              Browse Files
            </Button>
            <Input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
            <Button variant="outline" onClick={onCameraOpen}>
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
