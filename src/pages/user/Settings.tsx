import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PixKeysManager from "@/components/pix/PixKeysManager";
import { useAuth } from "@/hooks/use-auth"; // Add this if not already imported

const UserSettings = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Chaves Pix</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie suas chaves Pix para receber pagamentos.
            </p>
            <Separator />
            {/* Update the PixKeysManager with userId prop */}
            <PixKeysManager userId={user?.id || ''} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
