
import { MessageSquareIcon, PlusCircleIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ClientActions = () => {
  const { toast } = useToast();

  return (
    <Card className="p-4 border">
      <CardTitle className="text-lg mb-4">Ações Rápidas</CardTitle>
      <div className="grid grid-cols-1 gap-4">
        <Button onClick={() => toast({ title: "Solicitação de Pagamento", description: "Função ainda não implementada completamente." })}>
          <WalletIcon className="h-4 w-4 mr-2" />
          Solicitar Pagamento
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Nova Máquina", description: "Função ainda não implementada completamente." })}>
          <PlusCircleIcon className="h-4 w-4 mr-2" />
          Solicitar Nova Máquina
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Suporte", description: "Função ainda não implementada completamente." })}>
          <MessageSquareIcon className="h-4 w-4 mr-2" />
          Contatar Suporte
        </Button>
      </div>
    </Card>
  );
};

export default ClientActions;
