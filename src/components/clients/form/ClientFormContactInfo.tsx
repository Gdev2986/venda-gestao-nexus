
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "./ClientFormSchema";
import { FormMaskedInput } from "../FormMaskedInput";

interface ClientFormContactInfoProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ClientFormContactInfo = ({ form }: ClientFormContactInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Dados de Contato</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Contato<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormMaskedInput
          control={form.control}
          name="phone"
          label="Telefone"
          mask="(00) 00000-0000"
          placeholder="(00) 00000-0000"
          required
        />
      </div>
    </div>
  );
};
