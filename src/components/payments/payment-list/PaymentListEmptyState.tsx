
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PaymentListEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-md bg-muted/20">
      <div className="rounded-full bg-muted p-3">
        <FileX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Nenhum pagamento encontrado</h3>
      <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
        Não existem solicitações de pagamento que correspondam aos critérios de filtro atuais.
      </p>
      <Button 
        variant="outline"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Atualizar
      </Button>
    </div>
  );
};
