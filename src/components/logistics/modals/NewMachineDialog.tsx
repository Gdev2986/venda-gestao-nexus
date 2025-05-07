
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMachineDialog: React.FC<NewMachineDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  
  const handleSubmit = () => {
    onOpenChange(false);
    toast({
      title: "Máquina cadastrada",
      description: "A máquina foi cadastrada com sucesso."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Máquina</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar uma nova máquina ao sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pro">Terminal Pro</SelectItem>
                  <SelectItem value="standard">Terminal Standard</SelectItem>
                  <SelectItem value="mini">Terminal Mini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serial">Número de Série</Label>
              <Input id="serial" placeholder="Ex: SN-10xxxx" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status Inicial</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Em Estoque</SelectItem>
                <SelectItem value="client">Alocada para Cliente</SelectItem>
                <SelectItem value="maintenance">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Cliente (opcional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente1">Cliente ABC</SelectItem>
                <SelectItem value="cliente2">Cliente DEF</SelectItem>
                <SelectItem value="cliente3">Cliente GHI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMachineDialog;
