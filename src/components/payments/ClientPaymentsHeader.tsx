
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

interface ClientPaymentsHeaderProps {
  onRequestPayment: () => void;
}

export const ClientPaymentsHeader = ({ onRequestPayment }: ClientPaymentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
      
      <Button onClick={onRequestPayment}>
        <SendIcon className="h-4 w-4 mr-2" />
        Solicitar Pagamento
      </Button>
    </div>
  );
};
