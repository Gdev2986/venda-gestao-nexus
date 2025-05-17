
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormMaskedInput } from "./FormMaskedInput";
import { usePartnersSelect } from "@/hooks/use-partners-select";
import { Loader2 } from "lucide-react";

interface BusinessInfoFieldsProps {
  form: UseFormReturn<any>;
}

const BusinessInfoFields = ({ form }: BusinessInfoFieldsProps) => {
  const { partners, isLoading: isLoadingPartners } = usePartnersSelect();

  return (
    <>
      <FormField
        control={form.control}
        name="business_name"
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
        name="document"
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
              value={field.value}
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
                  partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.company_name}
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
        name="balance"
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
    </>
  );
};

export default BusinessInfoFields;
