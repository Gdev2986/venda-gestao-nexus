
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";

interface AdminProfileProps {
  name: string;
  email: string;
  role: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: string) => void;
  isSaving: boolean;
  onProfileUpdate: () => void;
  onCancel: () => void;
}

export const AdminProfile = ({
  name,
  email,
  role,
  setName,
  setEmail,
  setRole,
  isSaving,
  onProfileUpdate,
  onCancel,
}: AdminProfileProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil de Administrador</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações pessoais e de perfil
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Perfil</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
              <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
              <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
              <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
              <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button onClick={onProfileUpdate} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
};
