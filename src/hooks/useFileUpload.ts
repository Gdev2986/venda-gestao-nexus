
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseFileUploadOptions {
  bucket: string;
  allowedTypes: string[];
  maxSizeInMB: number;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!options.allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: `Tipos permitidos: ${options.allowedTypes.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    // Check file size
    const maxSizeInBytes = options.maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast({
        title: "Arquivo muito grande",
        description: `Tamanho máximo: ${options.maxSizeInMB}MB`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Erro no upload",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      setUploadProgress(100);
      return data.path;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: "Falha ao fazer upload do arquivo",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileUrl = (path: string): string => {
    const { data } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return {
    uploadFile,
    getFileUrl,
    isUploading,
    uploadProgress,
    validateFile
  };
};
