
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

  // Handle single role selection
  const handleRoleToggle = (role: UserRole) => {
    if (allowedRoles.includes(role)) {
      // Remove role if already selected
      setAllowedRoles(allowedRoles.filter(r => r !== role));
    } else {
      // Add role if not selected
      setAllowedRoles([...allowedRoles, role]);
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
              <div className="mt-2 space-y-2">
                {Object.values(UserRole).map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`role-${role}`}
                      checked={allowedRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`role-${role}`} className="text-sm">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => handleSavePermissions({ roles: allowedRoles })}>Salvar Permissões</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
