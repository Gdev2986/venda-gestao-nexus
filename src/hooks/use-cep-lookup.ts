
import { useState } from "react";
import { useToast } from "./use-toast";

export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export function useCepLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const lookupCep = async (cep: string): Promise<CepData | null> => {
    // Remove any non-numeric characters
    const cleanCep = cep.replace(/\D/g, "");

    // Validate CEP length
    if (cleanCep.length !== 8) {
      setError(new Error("CEP inválido. O CEP deve conter 8 dígitos."));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar CEP. Tente novamente.");
      }
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error("CEP não encontrado.");
      }
      
      // Show success toast
      toast({
        title: "CEP localizado",
        description: `Endereço encontrado para o CEP ${cep}`,
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar CEP";
      setError(new Error(errorMessage));
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "Erro ao buscar CEP",
        description: errorMessage,
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { lookupCep, isLoading, error };
}
