
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

export function useIBGELocations() {
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [isLoadingStates, setIsLoadingStates] = useState<boolean>(false);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Load Brazilian states
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      setError(null);
      
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        
        if (!response.ok) {
          throw new Error("Erro ao carregar estados. Por favor, tente novamente.");
        }
        
        const data = await response.json();
        setStates(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar estados";
        setError(new Error(errorMessage));
        
        toast({
          variant: "destructive",
          title: "Erro ao carregar estados",
          description: errorMessage,
        });
      } finally {
        setIsLoadingStates(false);
      }
    };
    
    fetchStates();
  }, [toast]);

  // Load cities when state changes
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
          throw new Error("Erro ao carregar cidades. Por favor, tente novamente.");
        }
        
        const data = await response.json();
        setCities(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar cidades";
        setError(new Error(errorMessage));
        
        toast({
          variant: "destructive",
          title: "Erro ao carregar cidades",
          description: errorMessage,
        });
      } finally {
        setIsLoadingCities(false);
      }
    };
    
    fetchCities();
  }, [selectedState, toast]);

  // Function to get state name from state abbreviation
  const getStateNameBySigla = useCallback((sigla: string): string => {
    const state = states.find(s => s.sigla === sigla);
    return state ? state.nome : sigla;
  }, [states]);

  return {
    states,
    cities,
    selectedState,
    setSelectedState,
    isLoadingStates,
    isLoadingCities,
    error,
    getStateNameBySigla
  };
}
