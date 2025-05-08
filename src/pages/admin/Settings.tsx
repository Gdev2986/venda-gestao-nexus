
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AdminSettings = () => {
  const [allowedRoles, setAllowedRoles] = useState<UserRole[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar papéis permitidos do localStorage ou valores padrão
    const storedRoles = localStorage.getItem('allowedRoles');
    if (storedRoles) {
      try {
        setAllowedRoles(JSON.parse(storedRoles) as UserRole[]);
      } catch (error) {
        console.error("Erro ao analisar allowedRoles:", error);
        // Definir papéis padrão se houver erro
        setAllowedRoles([
          UserRole.ADMIN, 
          UserRole.LOGISTICS, 
          UserRole.CLIENT, 
          UserRole.PARTNER, 
          UserRole.FINANCIAL
        ]);
      }
    } else {
      // Definir papéis padrão se nada estiver armazenado
      setAllowedRoles([
        UserRole.ADMIN, 
        UserRole.LOGISTICS, 
        UserRole.CLIENT, 
        UserRole.PARTNER, 
        UserRole.FINANCIAL
      ]);
    }
  }, []);
  
  const handleSavePermissions = async (values: { roles: UserRole[] }) => {
    try {
      // Salvar os papéis selecionados no localStorage
      localStorage.setItem('allowedRoles', JSON.stringify(values.roles));
      
      toast({
        title: "Permissões salvas",
        description: "As permissões foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as permissões.",
      });
    }
  };

  const handleSelectionChange = (value: string) => {
    // Converter string separada por vírgula para array de UserRole
    const selectedRoles = value
      .split(',')
      .map(role => role as UserRole);
    
    setAllowedRoles(selectedRoles);
    handleSavePermissions({ roles: selectedRoles });
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
                value={allowedRoles.join(',')}
                onValueChange={handleSelectionChange}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Selecione as permissões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
                  <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
                  <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
                  <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
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
