
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { CircleX, Upload, File } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  label?: string;
  currentFile?: File | null;
}

export const FileUploader = ({ onFileSelect, accept = "*", label, currentFile }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setFileName(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Use the current file name if provided
  const displayName = fileName || (currentFile ? currentFile.name : null);

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      
      {!displayName ? (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-center text-gray-500">
            {label || "Arraste e solte um arquivo aqui ou clique para selecionar"}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
          <div className="flex items-center">
            <File className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">{displayName}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          >
            <CircleX className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Remover arquivo</span>
          </Button>
        </div>
      )}
    </div>
  );
};
