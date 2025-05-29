
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lock } from "lucide-react";

const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "A senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordChangeRequiredProps {
  user: any;
  onPasswordChanged: () => void;
}

export const PasswordChangeRequired = ({ user, onPasswordChanged }: PasswordChangeRequiredProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  const handlePasswordChange = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      // Update the user's password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (passwordError) {
        throw passwordError;
      }

      // Update profile to mark password as changed
      const { error: profileError } = await supabase.functions.invoke('update-user-after-password-change', {
        body: { user_id: user.id }
      });

      if (profileError) {
        console.error('Error updating profile after password change:', profileError);
        // Don't throw here as the password was successfully changed
      }

      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi alterada. Você pode agora usar o sistema normalmente.",
      });

      onPasswordChanged();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: error.message || "Não foi possível alterar a senha. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <Lock className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Alterar Senha</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Você está usando uma senha temporária. Por segurança, é necessário criar uma nova senha
              para continuar usando o sistema.
            </AlertDescription>
          </Alert>

          <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                {...form.register("newPassword")}
                placeholder="Digite sua nova senha"
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
                placeholder="Confirme sua nova senha"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Requisitos da senha:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Mínimo de 8 caracteres</li>
                <li>Pelo menos uma letra minúscula</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos um número</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
