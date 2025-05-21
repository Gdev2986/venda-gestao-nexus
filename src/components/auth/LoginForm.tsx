
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/ui/spinner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, needsPasswordChange } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        let errorMessage = "Falha na autenticação. Verifique seu email e senha.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: errorMessage,
        });
        return;
      }

      // Check if user needs to change password (first login)
      if (data && needsPasswordChange) {
        navigate(PATHS.CHANGE_PASSWORD);
        return;
      }

      // Regular login success
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      // Force a full page refresh to ensure clean state
      window.location.href = PATHS.DASHBOARD;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro durante o login.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a
                href={PATHS.FORGOT_PASSWORD}
                className="text-xs text-primary hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <a
              href={PATHS.REGISTER}
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
