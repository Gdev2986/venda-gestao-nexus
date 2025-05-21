
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { debounce } from "lodash";

interface AddressInputProps {
  onAddressChange: (addressData: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => void;
}

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const AddressInput: React.FC<AddressInputProps> = ({ onAddressChange }) => {
  const [cep, setCep] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Função para formatar o CEP
  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/^(\d{5})(\d)/, "$1-$2") // Adiciona hífen após o 5º dígito
      .substring(0, 9); // Limita a 9 caracteres (5 + hífen + 3)
  };
  
  // Função para buscar o CEP via API
  const fetchCEP = async (cepValue: string) => {
    if (cepValue.replace(/\D/g, "").length !== 8) return;
    
    setIsLoading(true);
    
    try {
      const cleanCEP = cepValue.replace(/\D/g, "");
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data: ViaCepResponse = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado e tente novamente.",
          variant: "destructive",
        });
        return;
      }
      
      // Atualiza os dados do endereço
      onAddressChange({
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      });
      
      // Não exibir toast de sucesso, apenas preencher os campos
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Ocorreu um erro ao consultar o CEP. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cria uma versão com debounce da função fetchCEP
  const debouncedFetchCEP = useCallback(
    debounce((value: string) => {
      if (value.replace(/\D/g, "").length === 8) {
        fetchCEP(value);
      }
    }, 800),
    []
  );
  
  // Manipulador para alteração do CEP
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatCEP(e.target.value);
    setCep(formattedCEP);
    
    // Chama a função com debounce para evitar múltiplas requisições
    if (formattedCEP.replace(/\D/g, "").length === 8) {
      debouncedFetchCEP(formattedCEP);
    }
  };
  
  // Manipulador para o blur do campo CEP
  const handleCEPBlur = () => {
    if (cep.replace(/\D/g, "").length === 8) {
      fetchCEP(cep);
    }
  };
  
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="cep">CEP</Label>
          <div className="flex">
            <Input
              id="cep"
              placeholder="00000-000"
              value={cep}
              onChange={handleCEPChange}
              onBlur={handleCEPBlur}
              maxLength={9}
              className="rounded-r-none"
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-l-none border-l-0"
              onClick={() => fetchCEP(cep)}
              disabled={isLoading || cep.replace(/\D/g, "").length !== 8}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
