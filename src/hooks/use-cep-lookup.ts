
import { useState } from "react";

interface CepData {
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

export const useCepLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const lookupCep = async (cep: string): Promise<CepData | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format CEP to remove any non-number characters
      const formattedCep = cep.replace(/\D/g, '');
      
      if (formattedCep.length !== 8) {
        throw new Error('CEP inválido. O CEP deve conter 8 dígitos.');
      }
      
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar o CEP.');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar o CEP'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupCep,
    isLoading,
    error
  };
};
