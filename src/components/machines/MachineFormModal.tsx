
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface MachineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  machines?: any[];
  clients?: any[];
}

const MachineFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  machines,
  clients,
}: MachineFormModalProps) => {
  const [formData, setFormData] = useState({
    serial_number: initialData?.serial_number || "",
    model: initialData?.model || "",
    client_id: initialData?.client_id || "",
    notes: initialData?.notes || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90%] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Cadastrar Nova Máquina</DialogTitle>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
          <p className="text-sm text-muted-foreground">Preencha os dados para cadastrar uma nova máquina.</p>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="serial_number" className="text-right">
              Número de Série *
            </Label>
            <Input
              id="serial_number"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleInputChange}
              placeholder="SN-000123"
              required
            />
            <p className="text-xs text-muted-foreground">Número único que identifica a máquina</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model" className="text-right">
              Modelo *
            </Label>
            <Select
              value={formData.model}
              onValueChange={(value) => handleSelectChange("model", value)}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model-a">Modelo A</SelectItem>
                <SelectItem value="model-b">Modelo B</SelectItem>
                <SelectItem value="model-c">Modelo C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client_id" className="text-right">
              Direcionar para
            </Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => handleSelectChange("client_id", value)}
            >
              <SelectTrigger id="client_id">
                <SelectValue placeholder="Selecione um cliente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                                  <SelectItem value="stock">Manter em estoque</SelectItem>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Se nenhum cliente for selecionado, a máquina será mantida em estoque
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-right">
              Notas / Observações
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Informações relevantes sobre a máquina"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end mt-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MachineFormModal;
