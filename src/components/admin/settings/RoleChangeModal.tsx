
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@/types/enums";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface RoleChangeModalProps {
  open?: boolean;
  isOpen?: boolean;
  user: ProfileData;
  onClose: () => void;
}

// Todas as roles disponíveis no sistema
const ALL_AVAILABLE_ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "CLIENT", label: "Cliente" },
  { value: "PARTNER", label: "Parceiro" },
  { value: "FINANCIAL", label: "Financeiro" },
  { value: "LOGISTICS", label: "Logística" },
];

export const RoleChangeModal = ({ 
  open, 
  isOpen, 
  user, 
  onClose 
}: RoleChangeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState(user.role);
  const isModalOpen = open || isOpen;

  const onSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole as any })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Função alterada",
        description: `Função do usuário ${user.name} alterada para ${newRole}`
      });
      onClose();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Erro",
        description: "Falha ao alterar a função do usuário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-96 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Alterar Função de {user.name}
        </h2>
        <div className="mb-6">
          <Label htmlFor="newRole" className="mb-2 block text-gray-700 dark:text-gray-300">
            Nova Função:
          </Label>
          <Select
            value={newRole}
            onValueChange={(value: string) => setNewRole(value)}
          >
            <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {ALL_AVAILABLE_ROLES.map(role => (
                <SelectItem 
                  key={role.value} 
                  value={role.value}
                  className="dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="dark:text-gray-300 dark:hover:bg-gray-700">
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
};
