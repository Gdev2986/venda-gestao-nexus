
import { useState } from 'react';

interface AddressData {
  state: string;
  city: string;
  neighborhood?: string;
  street?: string;
}

export function useCepLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupCep = async (cep: string): Promise<AddressData | null> => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      setError('CEP inválido');
      return null;
    }

    const cleanCep = cep.replace(/\D/g, '');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First try BrasilAPI
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }
      
      const data = await response.json();
      
      return {
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street
      };
    } catch (err) {
      // Try ViaCEP as fallback
      try {
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        
        if (!viaCepResponse.ok) {
          throw new Error('Erro ao consultar CEP');
        }
        
        const viaCepData = await viaCepResponse.json();  // Fixed this line, was using response instead of viaCepResponse
        
        if (viaCepData.erro) {
          throw new Error('CEP não encontrado');
        }
        
        return {
          state: viaCepData.uf,
          city: viaCepData.localidade,
          neighborhood: viaCepData.bairro,
          street: viaCepData.logradouro
        };
      } catch (fallbackErr) {
        console.error('Erro na consulta do CEP:', fallbackErr);
        setError('Não foi possível consultar o CEP. Preencha os campos manualmente.');
        return null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { lookupCep, isLoading, error };
}
