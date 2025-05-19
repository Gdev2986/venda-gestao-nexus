
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { LayoutDashboard, CreditCard, FileText, Monitor } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // If authenticated and finished loading, redirect to dashboard
    if (user && !isLoading) {
      console.log("Login: User authenticated, redirecting to dashboard");
      setRedirecting(true);
      navigate(PATHS.DASHBOARD); // This will be handled by the RootLayout component
    }
  }, [user, isLoading, navigate]);

  // If redirecting or loading, show a spinner
  if (isLoading || redirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">
          {redirecting ? "Redirecionando para o painel..." : "Carregando..."}
        </p>
      </div>
    );
  }

  // If still loading or the user is not authenticated, show the login page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background/50 to-background p-4 dark:from-background dark:to-background/80">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-5xl w-full">
        <div className="w-full md:w-1/2 md:pr-8 text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold mr-3">
              SP
            </div>
            <h1 className="text-3xl font-bold tracking-tight">SigmaPay</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Gestão de Vendas <span className="text-primary">Simplificada</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mb-6">
            Uma plataforma completa para gerenciar suas vendas de maquininhas, clientes, pagamentos e muito mais.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mb-2">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Dashboard Inteligente</h3>
              <p className="text-muted-foreground text-sm">Visualize todas as suas vendas e métricas em tempo real.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Gestão de Pagamentos</h3>
              <p className="text-muted-foreground text-sm">Receba seus pagamentos via PIX de forma rápida e segura.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mb-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Relatórios Detalhados</h3>
              <p className="text-muted-foreground text-sm">Análises completas sobre seu desempenho de vendas.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mb-2">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Multiplataforma</h3>
              <p className="text-muted-foreground text-sm">Acesse de qualquer dispositivo, em qualquer lugar.</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <LoginForm />
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to={PATHS.REGISTER} className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
