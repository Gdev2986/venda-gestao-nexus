
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { MachineFormValues } from "./MachineFormSchema";

interface MachineClientFieldProps {
  clients?: any[];
}

export const MachineClientField = ({ clients }: MachineClientFieldProps) => {
  const form = useFormContext<MachineFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente (opcional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="stock">Nenhum (estoque)</SelectItem>
              {clients?.map((client: any) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.business_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
