
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { PixKeyType } from '@/types';

export interface PixKeyFormProps {
  onSuccess: () => void;
}

export const PixKeyForm = ({ onSuccess }: PixKeyFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [keyType, setKeyType] = useState<PixKeyType>('CPF');
  const [keyValue, setKeyValue] = useState('');
  const [keyName, setKeyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyValue.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Informe o valor da chave PIX.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .insert({
          user_id: user?.id,
          type: keyType,
          key: keyValue,
          name: keyName || `Minha chave ${keyType}`,
          is_default: false
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Chave PIX adicionada",
        description: "Sua chave PIX foi adicionada com sucesso.",
      });
      
      // Reset form
      setKeyType('CPF');
      setKeyValue('');
      setKeyName('');
      setShowForm(false);
      
      // Call callback to refresh keys
      onSuccess();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar a chave PIX.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <Button variant="outline" onClick={() => setShowForm(true)}>
        Adicionar Nova Chave PIX
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <h4 className="font-medium mb-2">Nova Chave PIX</h4>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Chave</label>
        <Select 
          value={keyType} 
          onValueChange={(value: PixKeyType) => setKeyType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de chave" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CPF">CPF</SelectItem>
            <SelectItem value="CNPJ">CNPJ</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="PHONE">Telefone</SelectItem>
            <SelectItem value="EVP">Chave Aleatória</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Valor da Chave</label>
        <Input 
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          placeholder={
            keyType === 'CPF' ? '000.000.000-00' : 
            keyType === 'CNPJ' ? '00.000.000/0000-00' :
            keyType === 'EMAIL' ? 'email@exemplo.com' :
            keyType === 'PHONE' ? '(00) 00000-0000' : 
            'Chave aleatória'
          }
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome (opcional)</label>
        <Input 
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="Um nome para identificar esta chave"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowForm(false)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};
