
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const MACHINE_MODELS = [
  { value: "PagBank", label: "PagBank" },
  { value: "CeoPag", label: "CeoPag" },
  { value: "Rede", label: "Rede" }
];

export const MachineModelField = () => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => {
        console.log('MachineModelField - field value:', field.value);
        return (
          <FormItem>
            <FormLabel>Modelo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {MACHINE_MODELS.map((model) => {
                  console.log('Rendering model:', model.value, model.label);
                  if (!model.value || model.value === '') {
                    console.error('Model with empty value:', model);
                    return null;
                  }
                  return (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
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
