
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "./ClientFormSchema";
import { FormMaskedInput } from "../FormMaskedInput";
import { useEffect, useState } from "react";
import { useCepLookup } from "@/hooks/use-cep-lookup";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useDevice } from "@/hooks/use-device";
import { useIBGELocations } from "@/hooks/use-ibge-locations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientFormAddressInfoProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ClientFormAddressInfo = ({ form }: ClientFormAddressInfoProps) => {
  const [cep, setCep] = useState(form.watch("zip_code") || "");
  const { lookupCep, isLoading: isLoadingCep } = useCepLookup();
  const { isMobile } = useDevice();
  const { 
    states, 
    cities, 
    selectedState, 
    setSelectedState, 
    isLoadingStates, 
    isLoadingCities 
  } = useIBGELocations();

  useEffect(() => {
    const handleCepLookup = async () => {
      if (cep && cep.replace(/\D/g, "").length === 8) {
        const address = await lookupCep(cep);
        if (address) {
          form.setValue("address", address.logradouro || "");
          form.setValue("neighborhood", address.bairro || "");
          form.setValue("city", address.localidade || "");
          form.setValue("state", address.uf || "");
          setSelectedState(address.uf || "");
        }
      }
    };

    handleCepLookup();
  }, [cep, lookupCep, form, setSelectedState]);

  const handleCepChange = (value: string) => {
    setCep(value);
  };

  // Check current state value
  useEffect(() => {
    const currentState = form.watch("state");
    if (currentState && currentState !== selectedState) {
      setSelectedState(currentState);
    }
  }, [form.watch("state"), selectedState, setSelectedState]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <FormMaskedInput
            control={form.control}
            name="zip_code"
            label="CEP"
            mask="00000-000"
            placeholder="00000-000"
            required
            onChange={handleCepChange}
          />
        </div>

        <div className="md:col-span-1">
          <Button
            type="button"
            variant="outline"
            className="w-full h-10 mt-[1.75rem]"
            onClick={() => handleCepChange(cep)}
            disabled={isLoadingCep || !cep || cep.replace(/\D/g, '').length !== 8}
          >
            {isLoadingCep ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Buscando CEP...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar CEP
              </>
            )}
          </Button>
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className={isMobile ? "" : "md:col-span-1"}>
              <FormLabel>Endereço<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input placeholder="Rua, Avenida, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address_number"
          render={({ field }) => (
            <FormItem className={isMobile ? "" : "md:col-span-1"}>
              <FormLabel>Número<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem className={isMobile ? "" : "md:col-span-2"}>
              <FormLabel>Bairro<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input placeholder="Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado<span className="text-destructive"> *</span></FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedState(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingStates ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Carregando estados...</span>
                    </div>
                  ) : (
                    states.map((state) => (
                      <SelectItem key={state.sigla} value={state.sigla}>
                        {state.nome} ({state.sigla})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade<span className="text-destructive"> *</span></FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!selectedState || isLoadingCities}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma cidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingCities ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Carregando cidades...</span>
                    </div>
                  ) : (
                    cities.map((city) => (
                      <SelectItem key={city.id} value={city.nome}>
                        {city.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
