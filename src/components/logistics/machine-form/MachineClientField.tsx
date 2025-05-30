
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
              value={field.value || ""}
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
                  // Only render if client has valid id and name
                  if (!client.id || client.id.trim() === '' || !client.business_name) {
                    console.error('Client with empty or invalid data:', client);
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
