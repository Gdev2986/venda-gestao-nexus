
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: Client;
  onSubmit?: (data: any) => Promise<boolean>;
}

const ClientFormModal = ({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
}: ClientFormModalProps) => {
  const [formData, setFormData] = useState({
    // Company information
    company_name: initialData?.company_name || "",
    cnpj: initialData?.cnpj || "",
    partner_id: initialData?.partner_id || "",
    initial_balance: initialData?.initial_balance || 0,
    
    // Contact information
    contact_name: initialData?.contact_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    
    // Address information
    address: initialData?.address || "",
    address_number: initialData?.address_number || "",
    neighborhood: initialData?.neighborhood || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip_code: initialData?.zip_code || "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [availablePartners, setAvailablePartners] = useState<any[]>([]);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        const success = await onSubmit(formData);
        if (success) {
          onClose();
        }
      } else {
        // Default create logic
        const { data, error } = await supabase
          .from("clients")
          .insert([formData])
          .select();
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: `Erro ao criar cliente: ${error.message}`,
          });
          return;
        }
        
        toast({
          title: "Cliente criado",
          description: "O cliente foi criado com sucesso.",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao processar dados: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] sm:max-w-[80%] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados da Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Nome da Empresa *</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="partner_id">Parceiro</Label>
                <Select
                  value={formData.partner_id}
                  onValueChange={(value) => handleSelectChange("partner_id", value)}
                >
                  <SelectTrigger id="partner_id">
                    <SelectValue placeholder="Selecione um parceiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {availablePartners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="initial_balance">Saldo Inicial (R$)</Label>
                <Input
                  id="initial_balance"
                  name="initial_balance"
                  type="number"
                  value={formData.initial_balance}
                  onChange={handleInputChange}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Nome do Contato *</Label>
                <Input
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip_code">CEP *</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  placeholder="00000-000"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address_number">Número *</Label>
                <Input
                  id="address_number"
                  name="address_number"
                  value={formData.address_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
