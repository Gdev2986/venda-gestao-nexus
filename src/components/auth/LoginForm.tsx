
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/ui/spinner";
import { Lock, Mail } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AuthService } from "@/services/auth.service";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const { signIn, signInWithGoogle, needsPasswordChange } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [searchParams] = useSearchParams();
  
  // Handle OAuth redirects
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Check for OAuth error
      const error = searchParams.get('error_description');
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: decodeURIComponent(error),
        });
        return;
      }
      
      // Check if this is a Google OAuth redirect
      if (window.location.hash.includes('access_token')) {
        setIsGoogleSubmitting(true);
        
        try {
          // Check if the Google user is authorized
          const { success, error } = await AuthService.handleGoogleAuthResponse();
          
          if (!success) {
            toast({
              variant: "destructive",
              title: "Acesso negado",
              description: error || "Conta não autorizada. Contate o administrador.",
            });
            return;
          }
          
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo de volta!",
          });
          
          // Redirect to dashboard
          navigate(PATHS.DASHBOARD);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: error.message || "Ocorreu um erro durante o login com Google.",
          });
        } finally {
          setIsGoogleSubmitting(false);
        }
      }
    };
    
    handleOAuthRedirect();
  }, [searchParams, toast, navigate]);

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

      if (data && needsPasswordChange) {
        navigate(PATHS.CHANGE_PASSWORD);
        return;
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      navigate(PATHS.DASHBOARD);
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
  
  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      // The redirect will handle the rest
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login com Google",
        description: error.message || "Ocorreu um erro durante o login com Google.",
      });
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className={isMobile ? "pb-2" : ""}>
        <CardTitle className="text-xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className={`space-y-4 ${isMobile ? "pt-2 pb-2" : ""}`}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isSubmitting || isGoogleSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                to={PATHS.FORGOT_PASSWORD}
                className="text-xs text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={isSubmitting || isGoogleSubmitting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isGoogleSubmitting}
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
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          
          <Button 
            type="button"
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isGoogleSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Processando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                Google
              </>
            )}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Ao entrar, você concorda com os{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
              Política de Privacidade
            </Link>
            .
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
