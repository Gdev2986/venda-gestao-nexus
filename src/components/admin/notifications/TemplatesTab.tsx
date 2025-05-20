
import { Card, CardContent } from "@/components/ui/card";

export const TemplatesTab = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium">Templates de Notificação</h3>
        <p className="text-muted-foreground">
          Configure templates para diferentes tipos de notificação.
        </p>
        
        <div className="border rounded-lg p-4 mt-4 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Funcionalidade em desenvolvimento. Os templates serão disponibilizados em breve.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
