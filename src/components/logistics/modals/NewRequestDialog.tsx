import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useClients } from "@/hooks/use-clients";

interface NewRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const NewRequestDialog: React.FC<NewRequestDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: clients } = useClients();

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Solicitação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="client_id">Cliente</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="machine_model">Modelo da Máquina</Label>
            <Input
              id="machine_model"
              placeholder="Digite o modelo da máquina"
              {...register("machine_model", { required: "O modelo da máquina é obrigatório" })}
            />
            {errors.machine_model && <p className="text-red-500">{errors.machine_model.message}</p>}
          </div>
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Digite a quantidade"
              {...register("quantity", {
                required: "A quantidade é obrigatória",
                valueAsNumber: true,
              })}
            />
            {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
          </div>
          <Button type="submit">Enviar Solicitação</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
