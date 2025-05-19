
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "./ClientFormSchema";
import { FormMaskedInput } from "../FormMaskedInput";
import { useEffect, useState } from "react";
import { useCepLookup } from "@/hooks/use-cep-lookup";

interface ClientFormAddressInfoProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ClientFormAddressInfo = ({ form }: ClientFormAddressInfoProps) => {
  const [cep, setCep] = useState(form.watch("zip_code") || "");
  const { lookupCep, isLoading: isLoadingCep } = useCepLookup();

  useEffect(() => {
    const handleCepLookup = async () => {
      if (cep && cep.replace(/\D/g, "").length === 8) {
        const address = await lookupCep(cep);
        if (address) {
          form.setValue("address", address.logradouro || "");
          form.setValue("neighborhood", address.bairro || "");
          form.setValue("city", address.localidade || "");
          form.setValue("state", address.uf || "");
        }
      }
    };

    handleCepLookup();
  }, [cep, lookupCep, form]);

  const handleCepChange = (value: string) => {
    setCep(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormMaskedInput
          control={form.control}
          name="zip_code"
          label="CEP"
          mask="00000-000"
          placeholder="00000-000"
          required
          onChange={handleCepChange}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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
            <FormItem>
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input placeholder="São Paulo" {...field} />
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
              <FormControl>
                <Input placeholder="SP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
