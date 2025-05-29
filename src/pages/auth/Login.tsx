
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "@/hooks/use-media-query";
import LoginForm from "@/components/auth/LoginForm";
import { LayoutDashboard, CreditCard, FileText, Monitor } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (user && !isLoading) {
      console.log("Login: User authenticated, redirecting to home");
      setRedirecting(true);
      navigate(PATHS.HOME);
    }
  }, [user, isLoading, navigate]);

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

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
        {/* Logo for mobile */}
        {isMobile && (
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold mr-2">
                SP
              </div>
              <h1 className="text-2xl font-bold">SigmaPay</h1>
            </div>
          </div>
        )}
        
        {/* Left side content - hidden on mobile */}
        {!isMobile && (
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
        )}
        
        {/* Right side - login form (full width on mobile) */}
        <div className={`w-full ${isMobile ? "" : "md:w-1/2"} max-w-md`}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
