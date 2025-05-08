import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AdminSettings = () => {
  const [allowedRoles, setAllowedRoles] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial allowed roles from local storage or default values
    const storedRoles = localStorage.getItem('allowedRoles');
    if (storedRoles) {
      setAllowedRoles(JSON.parse(storedRoles));
    } else {
      // Set default roles if nothing is stored
      setAllowedRoles([UserRole.ADMIN, UserRole.LOGISTICS, UserRole.CLIENT, UserRole.PARTNER, UserRole.FINANCIAL].map(role => role.toString()));
    }
  }, []);
  
  const handleSavePermissions = async (values: any) => {
    try {
      // Convert enum values to strings
      const allowedRoles = [
        UserRole.ADMIN.toString(),
        UserRole.LOGISTICS.toString(),
        UserRole.CLIENT.toString(),
        UserRole.PARTNER.toString(),
        UserRole.FINANCIAL.toString()
      ];
      
      // Save the selected roles to local storage
      localStorage.setItem('allowedRoles', JSON.stringify(values.roles));
      
      toast({
        title: "Permissões salvas",
        description: "As permissões foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as permissões.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="allowedRoles">Permissões de Acesso</Label>
              <Select
                id="allowedRoles"
                multiple
                onValueChange={(values) => handleSavePermissions({ roles: values })}
                defaultValue={allowedRoles}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Selecione as permissões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN.toString()}>Administrador</SelectItem>
                  <SelectItem value={UserRole.LOGISTICS.toString()}>Logística</SelectItem>
                  <SelectItem value={UserRole.CLIENT.toString()}>Cliente</SelectItem>
                  <SelectItem value={UserRole.PARTNER.toString()}>Parceiro</SelectItem>
                  <SelectItem value={UserRole.FINANCIAL.toString()}>Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleSavePermissions({ roles: allowedRoles })}>Salvar Permissões</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
