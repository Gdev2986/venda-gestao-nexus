import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useCepLookup } from "@/hooks/use-cep-lookup";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { FormMaskedInput } from "./FormMaskedInput";

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
  const [lastLookedUpCep, setLastLookedUpCep] = useState("");
  
  // Watch the zip field to apply formatting
  const zipValue = form.watch("zip");

  const handleLookupCep = async () => {
    if (!zipValue || zipValue === lastLookedUpCep) return;
    
    setLastLookedUpCep(zipValue);
    const data = await lookupCep(zipValue);
    
    if (data) {
      // Set values but keep fields editable
      form.setValue("state", data.state, { shouldValidate: true });
      form.setValue("city", data.city, { shouldValidate: true });
      if (data.street) {
        form.setValue("address", data.street, { shouldValidate: true });
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                {error && <p className="text-sm text-muted-foreground mt-1">{error}</p>}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
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
                <Input placeholder="Estado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default AddressFields;
