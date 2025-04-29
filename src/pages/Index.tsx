
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { CreditCardIcon } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-5xl w-full">
        <div className="w-full md:w-1/2 md:pr-8 text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold mr-3">
              SP
            </div>
            <h1 className="text-3xl font-bold tracking-tight">SigmaPay</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Gestão de Vendas <span className="text-primary">Simplificada</span>
          </h2>
          
          <p className="text-gray-600 text-lg mb-6">
            Uma plataforma completa para gerenciar suas vendas de maquininhas, clientes, pagamentos e muito mais.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <CreditCardIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Dashboard Inteligente</h3>
              <p className="text-gray-500 text-sm">Visualize todas as suas vendas e métricas em tempo real.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <CreditCardIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Gestão de Pagamentos</h3>
              <p className="text-gray-500 text-sm">Receba seus pagamentos via PIX de forma rápida e segura.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <CreditCardIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Relatórios Detalhados</h3>
              <p className="text-gray-500 text-sm">Análises completas sobre seu desempenho de vendas.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <CreditCardIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Multiplaforma</h3>
              <p className="text-gray-500 text-sm">Acesse de qualquer dispositivo, em qualquer lugar.</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
