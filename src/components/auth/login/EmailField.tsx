
import React from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface EmailFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

const EmailField = ({ register, errors, disabled = false }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          placeholder="voce@exemplo.com"
          className="pl-10"
          autoComplete="email"
          disabled={disabled}
          {...register("email")}
        />
      </div>
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message as string}</p>
      )}
    </div>
  );
};

export default EmailField;
