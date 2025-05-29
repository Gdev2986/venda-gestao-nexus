
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import { PATHS } from "@/routes/paths";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <Card className="w-full max-w-md bg-[#1e293b] border-[#334155]">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-red-500"></div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-semibold text-white">
            Acesso Negado
          </h1>
          
          {/* Description */}
          <div className="space-y-3 text-gray-300">
            <p>Você não tem permissão para acessar esta página.</p>
            <p className="text-sm">
              Se você acredita que isso é um erro, entre em contato com o administrador do sistema.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="flex-1 bg-transparent border-[#475569] text-white hover:bg-[#475569] hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Link to={PATHS.HOME} className="flex-1">
              <Button className="w-full bg-[#0891b2] hover:bg-[#0e7490] text-white">
                <Home className="mr-2 h-4 w-4" />
                Ir para Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
