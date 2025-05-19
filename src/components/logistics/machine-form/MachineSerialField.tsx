
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { MachineFormValues } from "./MachineFormSchema";

export const MachineSerialField = () => {
  const form = useFormContext<MachineFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="serialNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Número de Série/ID</FormLabel>
          <FormControl>
            <Input placeholder="Ex: SN1234567890" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
