
import { MessageSquareIcon, PlusCircleIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const ClientActions = () => {
  return (
    <Card className="p-4 border">
      <CardTitle className="text-lg mb-4">Ações Rápidas</CardTitle>
      <div className="grid grid-cols-1 gap-4">
        <Button asChild>
          <Link to={PATHS.USER_PAYMENTS}>
            <WalletIcon className="h-4 w-4 mr-2" />
            Solicitar Pagamento
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`${PATHS.SUPPORT}`} state={{ requestType: "MACHINE" }}>
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Solicitar Nova Máquina
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={PATHS.SUPPORT}>
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Contatar Suporte
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default ClientActions;
