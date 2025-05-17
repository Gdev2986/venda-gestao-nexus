
import { useState, useEffect } from 'react';

interface State {
  id: number;
  nome: string;
  sigla: string;
}

interface City {
  id: number;
  nome: string;
}

export function useIBGELocations() {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      setError(null);
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        if (!response.ok) {
          throw new Error('Falha ao buscar estados');
        }
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
        setError('Não foi possível carregar os estados. Por favor, tente novamente.');
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoadingCities(true);
      setError(null);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`);
        if (!response.ok) {
          throw new Error('Falha ao buscar cidades');
        }
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        setError('Não foi possível carregar as cidades. Por favor, tente novamente.');
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState]);

  return {
    states,
    cities,
    selectedState,
    setSelectedState,
    isLoadingStates,
    isLoadingCities,
    error
  };
}
