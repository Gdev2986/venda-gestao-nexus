
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedTypes: string[];
  maxSizeInMB: number;
  currentFile?: File;
  isUploading?: boolean;
  uploadProgress?: number;
  className?: string;
}

export const FileUpload = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes,
  maxSizeInMB,
  currentFile,
  isUploading = false,
  uploadProgress = 0,
  className
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSizeInMB * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-red-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (currentFile) {
    return (
      <div className={cn("border rounded-lg p-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getFileIcon(currentFile)}
            <div>
              <p className="text-sm font-medium">{currentFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(currentFile.size)}
              </p>
            </div>
          </div>
          {!isUploading && onFileRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isUploading && (
          <div className="mt-3">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Enviando... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragActive || dragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        className
      )}
    >
      <input {...getInputProps()} />
      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm font-medium mb-2">
        Arraste um arquivo aqui ou clique para selecionar
      </p>
      <p className="text-xs text-muted-foreground">
        Tipos aceitos: {acceptedTypes.join(', ')} | Máximo: {maxSizeInMB}MB
      </p>
    </div>
  );
};
