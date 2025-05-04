
import { useState } from "react";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface RoleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onConfirm: (role: UserRole) => Promise<void>;
  changingRole: boolean;
}

export function RoleChangeDialog({
  isOpen,
  onClose,
  userId,
  onConfirm,
  changingRole
}: RoleChangeDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);
  const [notes, setNotes] = useState("");

  const handleConfirm = async () => {
    await onConfirm(selectedRole);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <DialogTitle>Alterar Função do Usuário</DialogTitle>
          </div>
          <DialogDescription>
            Selecione a nova função para o usuário ID: {userId}.
            Esta ação será registrada para fins de auditoria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Nova função</Label>
            <Select 
              value={selectedRole} 
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
                <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
                <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Justificativa</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Alteração solicitada pelo gerente devido à mudança de responsabilidades."
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              Por favor, forneça um motivo para esta alteração de função.
              Esta informação será registrada para fins de auditoria.
            </p>
          </div>

          {selectedRole === UserRole.ADMIN && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <p className="font-semibold text-destructive">Elevação de privilégios</p>
              </div>
              <p className="text-sm text-destructive">
                Você está concedendo permissões administrativas a este usuário.
                Certifique-se de que esta alteração foi devidamente autorizada.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={changingRole}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleConfirm}
            disabled={changingRole || !notes.trim()}
            variant={selectedRole === UserRole.ADMIN ? "destructive" : "default"}
          >
            {changingRole
              ? "Processando..."
              : "Confirmar Alteração"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
