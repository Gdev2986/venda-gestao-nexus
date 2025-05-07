
import { Card, CardContent } from "@/components/ui/card";

export const PaymentListLoadingState = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando pagamentos...</p>
        </div>
      </CardContent>
    </Card>
  );
};
