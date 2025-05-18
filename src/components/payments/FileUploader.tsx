
import React, { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';

export interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  accept?: string;
  id?: string;
  label?: string;
  currentFile?: File;
}

export function FileUploader({ 
  onFileSelect, 
  selectedFile = null,
  accept = "*", 
  id = "file-upload", 
  label,
  currentFile
}: FileUploaderProps) {
  // Use selectedFile or currentFile if provided
  const fileToDisplay = selectedFile || currentFile || null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      {!fileToDisplay ? (
        <div className="grid w-full items-center gap-1.5">
          <Input
            id={id}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>
      ) : (
        <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
          <div className="truncate flex-1">
            <p className="text-sm font-medium">{fileToDisplay.name}</p>
            <p className="text-xs text-muted-foreground">
              {(fileToDisplay.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="h-8 w-8 p-0"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
}
