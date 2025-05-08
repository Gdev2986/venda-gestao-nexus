
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Alterar Função de {user.name}
        </h2>
        <div className="mb-4">
          <Label htmlFor="newRole">Nova Função:</Label>
          <Select
            value={newRole}
            onValueChange={(value) => setNewRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
              <SelectItem value={UserRole.USER}>Usuário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
