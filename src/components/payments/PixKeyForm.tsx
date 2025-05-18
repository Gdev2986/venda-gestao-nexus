import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { PixKeyType } from "@/types/payment.types";

interface PixKeyFormProps {
  onSuccess?: () => void;
}

export function PixKeyForm({ onSuccess }: PixKeyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<PixKeyType | "">("");
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  
  
  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        Adicionar nova chave PIX
      </Button>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <h3 className="text-sm font-medium">Nova chave PIX</h3>
      
      <div className="space-y-2">
        <Label htmlFor="key-type">Tipo de chave</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as PixKeyType)}
          required
          disabled={isSubmitting}
        >
          <SelectTrigger id="key-type">
            <SelectValue placeholder="Selecione o tipo de chave" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CPF">CPF</SelectItem>
            <SelectItem value="CNPJ">CNPJ</SelectItem>
            <SelectItem value="EMAIL">E-mail</SelectItem>
            <SelectItem value="PHONE">Telefone</SelectItem>
            <SelectItem value="EVP">Chave aleatória</SelectItem>
            <SelectItem value="RANDOM">Chave aleatória (alt)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="key-value">Chave</Label>
        <Input
          id="key-value"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Digite sua chave PIX"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="key-name">Nome da chave</Label>
        <Input
          id="key-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Minha chave principal"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsOpen(false)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );

  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para adicionar uma chave PIX"
      });
      return;
    }
    
    if (!type || !key || !name) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar uma chave PIX"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      
      const insertPromise = supabase
        .from('pix_keys')
        .insert({
          user_id: user.id,
          type: type as any,
          key,
          name,
          is_default: false 
        })
        .select();
      
      insertPromise.then(({data, error}) => {
        if (error) throw error;
        
        toast({
          title: "Chave PIX adicionada",
          description: "Sua chave PIX foi adicionada com sucesso"
        });
        
        setType("");
        setKey("");
        setName("");
        setIsOpen(false);
        
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Não foi possível adicionar a chave PIX"
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar a chave PIX"
      });
      setIsSubmitting(false);
    }
  }
}
