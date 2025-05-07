
import { useState, useEffect } from "react";
import { usePixKeys } from "@/hooks/usePixKeys";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Check } from "lucide-react";

// Define the allowed PIX key types as a union type
type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";

interface PixKeysManagerProps {
  userId?: string;
}

const PixKeysManager = ({ userId }: PixKeysManagerProps) => {
  const { pixKeys, isLoadingPixKeys } = usePixKeys();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState({
    key: "",
    type: "CPF" as PixKeyType,
    name: "Minha chave",
    isDefault: false
  });
  
  const pixKeyTypes = [
    { value: "CPF", label: "CPF" },
    { value: "CNPJ", label: "CNPJ" },
    { value: "EMAIL", label: "E-mail" },
    { value: "PHONE", label: "Telefone" },
    { value: "RANDOM", label: "Chave aleatória" }
  ];

  const handleAddKey = async () => {
    if (!user && !userId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para adicionar uma chave PIX"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .insert({
          user_id: userId || user?.id,
          key: newKey.key,
          type: newKey.type,
          name: newKey.name,
          is_default: newKey.isDefault
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Chave adicionada",
        description: "Sua chave PIX foi adicionada com sucesso"
      });
      
      setIsAdding(false);
      setNewKey({
        key: "",
        type: "CPF" as PixKeyType,
        name: "Minha chave",
        isDefault: false
      });
      
    } catch (error) {
      console.error("Error adding PIX key:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar chave",
        description: "Não foi possível adicionar sua chave PIX"
      });
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Chave removida",
        description: "Sua chave PIX foi removida com sucesso"
      });
      
    } catch (error) {
      console.error("Error deleting PIX key:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover chave",
        description: "Não foi possível remover sua chave PIX"
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, set all keys to not default
      const { error: resetError } = await supabase
        .from('pix_keys')
        .update({ is_default: false })
        .eq('user_id', userId || user?.id);
        
      if (resetError) throw resetError;
      
      // Then set the selected key as default
      const { error } = await supabase
        .from('pix_keys')
        .update({ is_default: true })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Chave padrão atualizada",
        description: "Sua chave PIX padrão foi atualizada com sucesso"
      });
      
    } catch (error) {
      console.error("Error setting default PIX key:", error);
      toast({
        variant: "destructive",
        title: "Erro ao definir chave padrão",
        description: "Não foi possível definir sua chave PIX padrão"
      });
    }
  };

  if (isLoadingPixKeys) {
    return <div className="py-4">Carregando chaves PIX...</div>;
  }

  return (
    <div className="space-y-4">
      {pixKeys.length > 0 ? (
        <div className="space-y-4">
          {pixKeys.map((pixKey) => (
            <Card key={pixKey.id} className={pixKey.isDefault ? "border-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{pixKey.name}</h3>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span>{pixKey.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Chave:</span>
                        <span className="font-mono">{pixKey.key}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {!pixKey.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(pixKey.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Definir como padrão
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDeleteKey(pixKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {pixKey.isDefault && (
                  <div className="mt-3 text-xs text-primary flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Chave padrão para recebimentos
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Você ainda não possui chaves PIX cadastradas
        </div>
      )}

      {isAdding ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="key-name">Nome da chave</Label>
                <Input 
                  id="key-name" 
                  value={newKey.name}
                  onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                  placeholder="Ex: Minha chave principal"
                />
              </div>
              
              <div>
                <Label htmlFor="key-type">Tipo da chave</Label>
                <Select 
                  value={newKey.type} 
                  onValueChange={(value) => setNewKey({...newKey, type: value as PixKeyType})}
                >
                  <SelectTrigger id="key-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {pixKeyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="key-value">Chave PIX</Label>
                <Input 
                  id="key-value" 
                  value={newKey.key}
                  onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                  placeholder="Digite sua chave PIX"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-default"
                  checked={newKey.isDefault}
                  onCheckedChange={(checked) => setNewKey({...newKey, isDefault: checked})}
                />
                <Label htmlFor="is-default">Definir como chave padrão</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddKey}>
                  Salvar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" /> Adicionar nova chave PIX
        </Button>
      )}
    </div>
  );
};

export default PixKeysManager;
