
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormMaskedInput } from "../FormMaskedInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "./ClientFormSchema";
import { usePartnersSelect } from "@/hooks/use-partners-select";
import { Loader2 } from "lucide-react";

interface ClientFormCompanyInfoProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ClientFormCompanyInfo = ({ form }: ClientFormCompanyInfoProps) => {
  const { partners, isLoading: isLoadingPartners } = usePartnersSelect();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Dados da Empresa</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa<span className="text-destructive"> *</span></FormLabel>
              <FormControl>
                <Input placeholder="Nome da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormMaskedInput
          control={form.control}
          name="cnpj"
          label="CNPJ"
          mask="00.000.000/0000-00"
          placeholder="00.000.000/0000-00"
          required
        />
        
        <FormField
          control={form.control}
          name="partner_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parceiro</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um parceiro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingPartners ? (
                    <div className="flex justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {partners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.company_name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="initial_balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Inicial (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="0,00" 
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
