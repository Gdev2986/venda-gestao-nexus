
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
  user: ProfileData;
  newRole: string;
  setNewRole: (role: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const RoleChangeModal = ({ 
  user, 
  newRole, 
  setNewRole, 
  onClose, 
  onSave 
}: RoleChangeModalProps) => {
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available roles from the profiles table
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .not('role', 'is', null);

        if (error) throw error;

        // Extract unique roles
        const uniqueRoles = Array.from(new Set(data.map(item => item.role)));
        setAvailableRoles(uniqueRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          Alterar Função de {user.name}
        </h2>
        <div className="mb-6">
          <Label htmlFor="newRole" className="mb-2 block">Nova Função:</Label>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando funções disponíveis...</p>
          ) : (
            <Select
              value={newRole}
              onValueChange={(value) => setNewRole(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={loading}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
