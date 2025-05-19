
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MaskedInput } from "@/components/ui/masked-input";
import { Control } from "react-hook-form";

interface FormMaskedInputProps {
  control: Control<any>;
  name: string;
  label: string;
  mask: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export function FormMaskedInput({
  control,
  name,
  label,
  mask,
  placeholder,
  required = false,
  onChange,
}: FormMaskedInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-destructive"> *</span>}</FormLabel>
          <FormControl>
            <MaskedInput
              mask={mask}
              placeholder={placeholder}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
