
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SalesDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  isUploading: boolean;
}

const SalesDropzone: React.FC<SalesDropzoneProps> = ({ onFilesAccepted, isUploading }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file types
    const validFiles = acceptedFiles.filter(file => 
      file.name.toLowerCase().endsWith('.csv')
    );

    if (validFiles.length !== acceptedFiles.length) {
      setError("Alguns arquivos foram rejeitados. Apenas arquivos CSV são permitidos.");
    } else {
      setError(null);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
      onFilesAccepted(validFiles);
    }
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    disabled: isUploading
  });

  const clearFiles = () => {
    setSelectedFiles([]);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors text-center
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FileUp className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Solte os arquivos aqui..."
              : "Arraste os arquivos CSV aqui, ou clique para selecionar"}
          </p>
          <p className="text-xs text-muted-foreground">
            Apenas arquivos CSV com delimitador ";" são aceitos
          </p>
          
          {!isUploading && selectedFiles.length === 0 && (
            <Button size="sm" variant="outline" className="mt-2">
              Selecionar Arquivos
            </Button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-destructive flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {/* File list */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Arquivos selecionados ({selectedFiles.length})</h3>
              <Button variant="ghost" size="sm" onClick={clearFiles} disabled={isUploading}>
                Limpar
              </Button>
            </div>
            
            <div className="max-h-[200px] overflow-y-auto space-y-1 p-1">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center text-sm p-2 rounded bg-muted/50"
                >
                  <File className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  {isUploading ? (
                    <Loader className="h-4 w-4 ml-2 animate-spin text-primary" />
                  ) : (
                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                  )}
                </motion.div>
              ))}
            </div>
            
            {isUploading && (
              <div className="flex items-center justify-center py-2">
                <Loader className="h-5 w-5 mr-2 animate-spin text-primary" />
                <span className="text-sm">Processando arquivos...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesDropzone;
