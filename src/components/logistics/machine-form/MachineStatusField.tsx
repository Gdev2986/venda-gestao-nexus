
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { MachineFormValues } from "./MachineFormSchema";
import { MachineStatus } from "@/types/machine.types";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Operando" },
  { value: "MAINTENANCE", label: "Em Manutenção" },
  { value: "INACTIVE", label: "Parada" },
  { value: "STOCK", label: "Em Estoque" },
  { value: "TRANSIT", label: "Em Trânsito" },
  { value: "BLOCKED", label: "Bloqueada" }
];

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
              value={field.value || "ACTIVE"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => {
                  // Ensure all status values are valid
                  if (!status.value || status.value.trim() === '') {
                    console.error('Status with empty value:', status);
                    return null;
                  }
                  return (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
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
