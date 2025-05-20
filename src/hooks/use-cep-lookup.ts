
import { useState } from "react";
import { useToast } from "./use-toast";
import { useDebounce } from "./use-debounce";

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
  
  // Reference to store the current AbortController
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const lookupCep = async (cep: string): Promise<CepData | null> => {
    // Remove any non-numeric characters
    const cleanCep = cep.replace(/\D/g, "");

    // Validate CEP length
    if (cleanCep.length !== 8) {
      setError(new Error("CEP inválido. O CEP deve conter 8 dígitos."));
      return null;
    }

    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, { signal });
      
      if (!response.ok) {
        throw new Error("Erro ao buscar CEP. Tente novamente.");
      }
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error("CEP não encontrado.");
      }
      
      // No success toast - only notify on errors
      return data;
    } catch (err) {
      // Don't show errors for aborted requests
      if ((err as Error).name === 'AbortError') {
        return null;
      }
      
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

  // Create a debouncedLookupCep function that will only execute after the debounce period
  const debouncedLookupCep = async (cep: string): Promise<CepData | null> => {
    // Only proceed if CEP has exactly 8 digits
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      return null;
    }
    
    return lookupCep(cleanCep);
  };

  return { lookupCep: debouncedLookupCep, isLoading, error };
}
