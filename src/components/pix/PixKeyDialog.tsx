
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PixKey } from "@/types";

interface PixKeyFormData {
  id?: string;
  key: string;
  type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";
  name: string;
  is_default?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface PixKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pixKeyData?: PixKey | null;
  onSave: (keyData: PixKeyFormData) => Promise<void>;
  loading: boolean;
}

const PixKeyDialog = ({
  open,
  onOpenChange,
  pixKeyData,
  onSave,
  loading
}: PixKeyDialogProps) => {
  const [formData, setFormData] = useState<PixKeyFormData>({
    key: "",
    type: "CPF",
    name: "",
    is_default: false
  });

  useEffect(() => {
    if (pixKeyData) {
      setFormData({
        id: pixKeyData.id,
        key: pixKeyData.key,
        type: pixKeyData.type as "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM",
        name: pixKeyData.name || pixKeyData.owner_name || "",
        is_default: pixKeyData.is_default
      });
    } else {
      setFormData({
        key: "",
        type: "CPF",
        name: "",
        is_default: false
      });
    }
  }, [pixKeyData]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{pixKeyData ? "Editar" : "Nova"} Chave PIX</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="PHONE">Telefone</SelectItem>
                  <SelectItem value="RANDOM">Chave aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="key">Chave</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => handleChange("key", e.target.value)}
                placeholder="Digite a chave PIX"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nome para identificação"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => handleChange("is_default", checked)}
              />
              <Label htmlFor="is_default">Definir como chave padrão</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : pixKeyData ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PixKeyDialog;
