
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/components/auth/schemas/authSchemas";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import SocialLoginButtons from "./SocialLoginButtons";
import { useAuthActions } from "../hooks/useAuthActions";
import { useToast } from "@/hooks/use-toast";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { handleEmailPasswordLogin, handleGoogleLogin, isLoading } = useAuthActions();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    
    try {
      const response = await handleEmailPasswordLogin(data.email, data.password);
      
      if (!response.success) {
        setError(response.error || "Ocorreu um erro durante o login.");
        toast({
          variant: "destructive",
          title: "Erro de Login",
          description: response.error || "Credenciais inválidas.",
        });
      } else {
        toast({
          title: "Login bem-sucedido",
          description: "Redirecionando para o dashboard...",
        });
      }
    } catch (err: any) {
      console.error("Unexpected error during login:", err);
      setError("Ocorreu um erro inesperado. Por favor, tente novamente.");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EmailField register={form.register} errors={form.formState.errors} disabled={isLoading} />
        <PasswordField register={form.register} errors={form.formState.errors} disabled={isLoading} />
        
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>
        
        <SocialLoginButtons />
      </form>
    </Form>
  );
};

export default LoginForm;
