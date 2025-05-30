
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { MachineFormValues } from "./MachineFormSchema";

interface MachineClientFieldProps {
  clients?: any[];
}

export const MachineClientField = ({ clients }: MachineClientFieldProps) => {
  const form = useFormContext<MachineFormValues>();
  
  console.log('MachineClientField - clients:', clients);
  
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => {
        console.log('MachineClientField - field value:', field.value);
        return (
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
                {clients?.map((client: any) => {
                  console.log('Rendering client:', client.id, client.business_name);
                  if (!client.id || client.id === '') {
                    console.error('Client with empty or undefined ID:', client);
                    return null;
                  }
                  return (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
