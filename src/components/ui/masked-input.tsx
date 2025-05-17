
import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  mask: string;
  onChange?: (value: string, rawValue: string) => void;
}

export function MaskedInput({ 
  mask, 
  value, 
  onChange, 
  className, 
  ...props 
}: MaskedInputProps) {
  const [displayValue, setDisplayValue] = React.useState("");

  React.useEffect(() => {
    if (typeof value === "string") {
      const formatted = applyMask(value, mask);
      setDisplayValue(formatted);
    }
  }, [value, mask]);

  const applyMask = (value: string, mask: string): string => {
    let result = "";
    let valueIndex = 0;
    let maskIndex = 0;

    while (maskIndex < mask.length && valueIndex < value.length) {
      if (mask[maskIndex] === "0") {
        // Digit placeholder
        if (/\d/.test(value[valueIndex])) {
          result += value[valueIndex];
          valueIndex++;
        } else {
          valueIndex++;
          continue;
        }
      } else if (mask[maskIndex] === "A") {
        // Letter placeholder
        if (/[a-zA-Z]/.test(value[valueIndex])) {
          result += value[valueIndex];
          valueIndex++;
        } else {
          valueIndex++;
          continue;
        }
      } else if (mask[maskIndex] === "*") {
        // Any character placeholder
        result += value[valueIndex];
        valueIndex++;
      } else {
        // Static mask character
        result += mask[maskIndex];
        if (value[valueIndex] === mask[maskIndex]) {
          valueIndex++;
        }
      }
      maskIndex++;
    }

    return result;
  };

  const removeMask = (value: string, mask: string): string => {
    let result = "";
    let valueIndex = 0;

    for (let i = 0; i < value.length; i++) {
      if (valueIndex >= value.length) break;

      if (mask[i] === "0" || mask[i] === "A" || mask[i] === "*") {
        result += value[valueIndex];
      } else if (value[valueIndex] === mask[i]) {
        // Skip mask character if it matches
      } else {
        result += value[valueIndex];
      }
      
      valueIndex++;
    }

    return result.replace(/[^a-zA-Z0-9]/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\w\s]/gi, "");
    const formattedValue = applyMask(rawValue, mask);
    setDisplayValue(formattedValue);
    
    if (onChange) {
      onChange(formattedValue, rawValue);
    }
  };

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      className={cn(className)}
    />
  );
}
