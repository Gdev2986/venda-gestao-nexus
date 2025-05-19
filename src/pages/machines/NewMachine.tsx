
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PATHS } from "@/routes/paths";

const NewMachine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("STOCK");
  const [notes, setNotes] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serialNumber || !model) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o número de série e o modelo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('machines')
        .insert([
          {
            serial_number: serialNumber,
            model: model,
            status: status,
            notes: notes
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Máquina cadastrada com sucesso",
        description: `A máquina ${serialNumber} foi adicionada ao sistema.`
      });
      
      // Navigate back to machines list
      navigate(PATHS.LOGISTICS.MACHINES);
      
    } catch (error: any) {
      console.error("Error creating machine:", error);
      
      toast({
        title: "Erro ao cadastrar máquina",
        description: error.message || "Ocorreu um erro ao cadastrar a máquina.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Cadastrar Nova Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Série *</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Ex: SN-123456"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Terminal Pro">Terminal Pro</SelectItem>
                  <SelectItem value="Terminal Standard">Terminal Standard</SelectItem>
                  <SelectItem value="Terminal Mini">Terminal Mini</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK">Em Estoque</SelectItem>
                  <SelectItem value="ACTIVE">Operando</SelectItem>
                  <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                  <SelectItem value="INACTIVE">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informações adicionais sobre a máquina"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(PATHS.LOGISTICS.MACHINES)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar Máquina"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewMachine;
