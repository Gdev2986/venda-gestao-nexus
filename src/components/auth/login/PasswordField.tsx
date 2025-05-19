
import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface PasswordFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

const PasswordField = ({ register, errors, disabled = false }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Senha</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-10"
          autoComplete="current-password"
          disabled={disabled}
          {...register("password")}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-8 w-8 p-0"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">Alternar visibilidade da senha</span>
        </Button>
      </div>
      {errors.password && (
        <p className="text-sm text-destructive">{errors.password.message as string}</p>
      )}
    </div>
  );
};

export default PasswordField;
