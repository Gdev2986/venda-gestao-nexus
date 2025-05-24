import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acesso Negado
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="w-full"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 