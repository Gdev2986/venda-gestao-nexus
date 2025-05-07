
import { Card, CardContent } from "@/components/ui/card";

export const PaymentListEmptyState = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-4">
          <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
        </div>
      </CardContent>
    </Card>
  );
};
