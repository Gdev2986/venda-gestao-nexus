
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { MachineFormValues } from "./MachineFormSchema";

export const MachineModelField = () => {
  const form = useFormContext<MachineFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Modelo</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Terminal Pro" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
