
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, MessageSquare, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { PATHS } from "@/routes/paths";

export default function ClientActions() {
  return (
    <Card className="p-5 space-y-4">
      <h3 className="text-lg font-medium">Ações Rápidas</h3>
      <div className="grid grid-cols-1 gap-3">
        <Button variant="outline" className="justify-between" asChild>
          <Link to={PATHS.USER.PAYMENTS}>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Ver meus pagamentos
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button variant="outline" className="justify-between" asChild>
          <Link to={PATHS.USER.SUPPORT}>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Abrir um chamado
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button variant="outline" className="justify-between" asChild>
          <Link to={PATHS.USER.SUPPORT}>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Solicitar comprovantes
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
