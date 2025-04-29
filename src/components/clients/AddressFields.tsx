
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

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
  zip: z.string().min(5, {
    message: "O CEP deve ter pelo menos 5 caracteres.",
  }),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFieldsProps {
  form: UseFormReturn<any>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Endereço completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
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
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="Estado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input placeholder="00000-000" {...field} />
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
