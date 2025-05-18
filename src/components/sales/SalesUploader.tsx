
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface SalesUploaderProps {
  onFileProcessed?: (file: File, recordCount: number) => void;
}

export const SalesUploader: React.FC<SalesUploaderProps> = ({ onFileProcessed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a CSV file
    if (!file.name.endsWith(".csv")) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, we would actually parse and process the file
      // For now, we'll just simulate success with a random record count
      const recordCount = Math.floor(Math.random() * 50) + 10;

      toast({
        title: "Importação bem-sucedida",
        description: `${recordCount} vendas foram importadas.`,
      });

      if (onFileProcessed) {
        onFileProcessed(file, recordCount);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: "Houve um erro ao processar o arquivo CSV.",
      });
    } finally {
      setIsLoading(false);
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv"
      />
      <Button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="gap-2"
      >
        <Upload size={16} />
        {isLoading ? "Processando..." : "Importar vendas"}
      </Button>
    </>
  );
};

export default SalesUploader;
