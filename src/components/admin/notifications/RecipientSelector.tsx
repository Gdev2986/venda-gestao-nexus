
import { useState } from "react";
import { UserRole } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Checkbox
} from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RecipientSelectorProps {
  recipientType: "all" | "roles";
  selectedRoles: UserRole[];
  onRecipientTypeChange: (value: "all" | "roles") => void;
  onRoleToggle: (role: UserRole) => void;
}

export const RecipientSelector = ({ 
  recipientType,
  selectedRoles,
  onRecipientTypeChange,
  onRoleToggle
}: RecipientSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="recipientType">
          Destinatários
        </Label>
        <Select
          value={recipientType}
          onValueChange={(value: "all" | "roles") => onRecipientTypeChange(value)}
        >
          <SelectTrigger id="recipientType">
            <SelectValue placeholder="Selecione os destinatários" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os usuários</SelectItem>
            <SelectItem value="roles">Funções específicas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recipientType === "roles" && (
        <div className="space-y-2 border rounded-md p-3">
          <Label className="block mb-2">Selecione as funções:</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-admin" 
                  checked={selectedRoles.includes(UserRole.ADMIN)}
                  onCheckedChange={() => onRoleToggle(UserRole.ADMIN)}
                />
                <Label htmlFor="role-admin">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-client" 
                  checked={selectedRoles.includes(UserRole.CLIENT)}
                  onCheckedChange={() => onRoleToggle(UserRole.CLIENT)}
                />
                <Label htmlFor="role-client">Cliente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-financial" 
                  checked={selectedRoles.includes(UserRole.FINANCIAL)}
                  onCheckedChange={() => onRoleToggle(UserRole.FINANCIAL)}
                />
                <Label htmlFor="role-financial">Financeiro</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-partner" 
                  checked={selectedRoles.includes(UserRole.PARTNER)}
                  onCheckedChange={() => onRoleToggle(UserRole.PARTNER)}
                />
                <Label htmlFor="role-partner">Parceiro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-logistics" 
                  checked={selectedRoles.includes(UserRole.LOGISTICS)}
                  onCheckedChange={() => onRoleToggle(UserRole.LOGISTICS)}
                />
                <Label htmlFor="role-logistics">Logística</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="role-user" 
                  checked={selectedRoles.includes(UserRole.USER)}
                  onCheckedChange={() => onRoleToggle(UserRole.USER)}
                />
                <Label htmlFor="role-user">Usuário</Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
