
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import SocialLoginButtons from "./SocialLoginButtons";
import { useAuthActions } from "../hooks/useAuthActions";
import { loginFormSchema } from "../schemas/authSchemas";

type FormData = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { handleEmailPasswordLogin } = useAuthActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setAuthError(null);
      const result = await handleEmailPasswordLogin(data.email, data.password);
      
      if (result.success) {
        setLoginSuccess(true);
      } else {
        setAuthError(result.error || "Erro desconhecido durante o login");
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      setAuthError(error.message || "Ocorreu um erro inesperado durante o login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <EmailField register={register} errors={errors} disabled={loginSuccess} />
      <PasswordField register={register} errors={errors} disabled={loginSuccess} />

      {authError && (
        <Alert variant="destructive">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      {loginSuccess && (
        <Alert>
          <AlertDescription className="text-green-600">Login bem-sucedido. Redirecionando...</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loginSuccess}>
        {loginSuccess ? (
          <span className="flex items-center">
            <Spinner size="sm" className="mr-2" /> Redirecionando...
          </span>
        ) : (
          "Entrar"
        )}
      </Button>
      
      <SocialLoginButtons disabled={loginSuccess} />
    </form>
  );
};

export default LoginForm;
