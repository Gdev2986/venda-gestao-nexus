
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useCepLookup } from "@/hooks/use-cep-lookup";
import { useIBGELocations } from "@/hooks/use-ibge-locations";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { FormMaskedInput } from "./FormMaskedInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema for the address fields
export const addressSchema = z.object({
  address: z.string().min(2, {
    message: "O endereço deve ter pelo menos 2 caracteres.",
  }),
  city: z.string().min(2, {
    message: "A cidade deve ter pelo menos 2 caracteres.",
  }),
  state: z.string().min(2, {
    message: "O estado deve ter pelo menos 2 caracteres.",
  }),
  zip: z.string().min(8, {
    message: "O CEP deve ter pelo menos 8 caracteres.",
  }),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFieldsProps {
  form: UseFormReturn<any>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  const { lookupCep, isLoading, error } = useCepLookup();
  const { 
    states, 
    cities, 
    selectedState, 
    setSelectedState, 
    isLoadingStates, 
    isLoadingCities,
    error: locationError
  } = useIBGELocations();
  
  // Watch the zip field to apply formatting
  const zipValue = form.watch("zip");
  const stateValue = form.watch("state");
  
  // Update the selectedState when the form state value changes
  useEffect(() => {
    if (stateValue && stateValue !== selectedState) {
      setSelectedState(stateValue);
    }
  }, [stateValue, selectedState, setSelectedState]);

  const handleLookupCep = async () => {
    if (!zipValue) return;
    
    const data = await lookupCep(zipValue);
    
    if (data) {
      // Set the address if available from CEP lookup - using logradouro from CepData
      if (data.logradouro) {
        form.setValue("address", data.logradouro, { shouldValidate: true });
      }
      
      // We still get state and city from CEP lookup, but user can change them after
      if (data.uf) {
        form.setValue("state", data.uf, { shouldValidate: true });
        setSelectedState(data.uf);
      }
      
      if (data.localidade) {
        form.setValue("city", data.localidade, { shouldValidate: true });
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço<span className="text-destructive"> *</span></FormLabel>
            <FormControl>
              <Input placeholder="Endereço completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP<span className="text-destructive"> *</span></FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <FormMaskedInput 
                      control={form.control}
                      name="zip"
                      label=""
                      mask="99999-999"
                      placeholder="00000-000"
                      required
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleLookupCep}
                    disabled={isLoading || !zipValue || zipValue.replace(/\D/g, '').length !== 8}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-destructive mt-1">{error.message}</p>}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  ) : locationError ? (
                    <div className="p-2 text-sm text-destructive">
                      Erro ao carregar estados. Tente novamente.
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
                  ) : locationError ? (
                    <div className="p-2 text-sm text-destructive">
                      Erro ao carregar cidades. Tente novamente.
                    </div>
                  ) : cities.length === 0 && selectedState ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Nenhuma cidade encontrada para este estado.
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
    </>
  );
};

export default AddressFields;
