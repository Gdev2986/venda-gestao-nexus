
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { MachineFormValues } from "./MachineFormSchema";
import { MachineStatus } from "@/types/machine.types";

export const MachineStatusField = () => {
  const form = useFormContext<MachineFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => {
        console.log('MachineStatusField - field value:', field.value);
        return (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ACTIVE">Operando</SelectItem>
                <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                <SelectItem value="INACTIVE">Parada</SelectItem>
                <SelectItem value="STOCK">Em Estoque</SelectItem>
                <SelectItem value="TRANSIT">Em Trânsito</SelectItem>
                <SelectItem value="BLOCKED">Bloqueada</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
