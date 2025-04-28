
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular login - em produção, será integrado com o backend
      setTimeout(() => {
        // Simulando um login bem-sucedido
        localStorage.setItem("user", JSON.stringify({
          id: "1",
          name: "João Silva",
          email: email,
          role: "CLIENT"
        }));
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Credenciais inválidas. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Acesse a plataforma de gestão de vendas
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a 
                href="#" 
                className="text-sm font-medium text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Recuperação de senha",
                    description: "Função ainda não implementada.",
                  });
                }}
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 px-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
          
          <p className="text-sm text-center text-muted-foreground">
            Não tem uma conta?{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                toast({
                  title: "Registro",
                  description: "Função ainda não implementada.",
                });
              }}
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
