import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PixKey } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash, Plus, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Define the PIX key types as a union type to match database requirements
type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";

export function PixKeysManager() {
  const { user } = useAuth();
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch PIX keys
  useEffect(() => {
    const fetchPixKeys = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('pix_keys')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const transformedKeys: PixKey[] = (data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          key_type: item.type,
          type: item.type,
          key: item.key,
          owner_name: item.name,
          name: item.name,
          isDefault: item.is_default, // Map from DB is_default to frontend isDefault
          is_active: true,
          created_at: item.created_at,
          updated_at: item.updated_at,
          // Add bank_name only for UI rendering, not for database operations
          bank_name: "Banco", // Default value since it's not in the database
        }));
        
        setPixKeys(transformedKeys);
      } catch (error) {
        console.error("Error fetching PIX keys:", error);
        toast({
          title: "Erro ao carregar chaves PIX",
          description: "Não foi possível carregar suas chaves PIX.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPixKeys();
  }, [user, toast]);

  // Create a new PIX key
  const handleAddPixKey = () => {
    if (!user) return;
    
    const newKey: PixKey = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      key_type: "CPF",
      type: "CPF",
      key: "",
      owner_name: "",
      name: "",
      isDefault: pixKeys.length === 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bank_name: "",
    };
    
    setPixKeys([...pixKeys, newKey]);
  };

  // Remove a PIX key
  const handleRemovePixKey = async (keyId: string) => {
    try {
      if (keyId.startsWith('temp-')) {
        // Just remove from state if it's a temporary key
        setPixKeys(pixKeys.filter(key => key.id !== keyId));
        return;
      }
      
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', keyId);
        
      if (error) throw error;
      
      setPixKeys(pixKeys.filter(key => key.id !== keyId));
      
      toast({
        title: "Chave PIX removida",
        description: "A chave PIX foi removida com sucesso."
      });
    } catch (error) {
      console.error("Error removing PIX key:", error);
      toast({
        title: "Erro ao remover chave PIX",
        description: "Não foi possível remover a chave PIX.",
        variant: "destructive",
      });
    }
  };

  // Handle input change for a PIX key
  const handleKeyChange = (keyId: string, field: keyof PixKey, value: string | boolean) => {
    setPixKeys(pixKeys.map(key => {
      if (key.id === keyId) {
        return { ...key, [field]: value };
      }
      return key;
    }));
  };

  // Set a PIX key as default
  const handleSetDefault = async (keyId: string) => {
    try {
      // Update state first
      setPixKeys(pixKeys.map(key => ({
        ...key,
        isDefault: key.id === keyId,
      })));
      
      // If it's not a temp key, update in database
      if (!keyId.startsWith('temp-')) {
        // First, remove default from all keys
        await supabase
          .from('pix_keys')
          .update({ is_default: false })
          .eq('user_id', user?.id);
          
        // Then set the selected key as default
        const { error } = await supabase
          .from('pix_keys')
          .update({ is_default: true })
          .eq('id', keyId);
          
        if (error) throw error;
      }
      
      toast({
        title: "Chave PIX padrão atualizada",
        description: "A chave PIX padrão foi atualizada com sucesso."
      });
    } catch (error) {
      console.error("Error setting default PIX key:", error);
      toast({
        title: "Erro ao atualizar chave PIX padrão",
        description: "Não foi possível definir a chave PIX como padrão.",
        variant: "destructive",
      });
    }
  };

  // Save a PIX key
  const handleSavePixKey = async (key: PixKey) => {
    try {
      // Validate required fields
      if (!key.key || !key.type) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }
      
      // Ensure type is one of the allowed values
      const validType = key.type as PixKeyType;
      if (!["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"].includes(validType)) {
        toast({
          title: "Tipo inválido",
          description: "O tipo de chave PIX selecionado é inválido.",
          variant: "destructive",
        });
        return;
      }
      
      // Format the key data for Supabase - only include fields that exist in the database
      const keyData = {
        user_id: key.user_id,
        type: validType,
        key: key.key,
        name: key.name || key.owner_name,
        is_default: key.isDefault, // Map from frontend isDefault to DB is_default
      };
      
      let response;
      
      if (key.id.startsWith('temp-')) {
        // Create new key
        response = await supabase
          .from('pix_keys')
          .insert(keyData)
          .select();
      } else {
        // Update existing key
        response = await supabase
          .from('pix_keys')
          .update(keyData)
          .eq('id', key.id)
          .select();
      }
      
      const { data, error } = response;
      
      if (error) {
        console.error("Error saving PIX key:", error);
        throw error;
      }
      
      // Update the key in the state with the new data from the server
      setPixKeys(prevKeys => prevKeys.map(k => {
        if (k.id === key.id) {
          return {
            ...k,
            ...(data?.[0] || {}),
            id: data?.[0]?.id || k.id,
            bank_name: k.bank_name, // Preserve bank_name for UI
          };
        }
        return k;
      }));
      
      toast({
        title: "Chave PIX salva",
        description: "A chave PIX foi salva com sucesso."
      });
    } catch (error) {
      console.error("Error saving PIX key:", error);
      toast({
        title: "Erro ao salvar chave PIX",
        description: "Não foi possível salvar a chave PIX.",
        variant: "destructive,
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando chaves PIX...</div>;
  }

  return (
    <div className="space-y-6">
      {pixKeys.map((key) => (
        <div key={key.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Chave PIX</h3>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePixKey(key.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`type-${key.id}`}>Tipo</Label>
              <Select 
                value={key.type} 
                onValueChange={(value) => handleKeyChange(key.id, 'type', value)}
              >
                <SelectTrigger id={`type-${key.id}`}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="EMAIL">E-mail</SelectItem>
                  <SelectItem value="PHONE">Telefone</SelectItem>
                  <SelectItem value="RANDOM">Chave aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor={`key-${key.id}`}>Chave</Label>
              <Input
                id={`key-${key.id}`}
                value={key.key}
                onChange={(e) => handleKeyChange(key.id, 'key', e.target.value)}
                placeholder="Digite sua chave PIX"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`name-${key.id}`}>Nome</Label>
              <Input
                id={`name-${key.id}`}
                value={key.name}
                onChange={(e) => handleKeyChange(key.id, 'name', e.target.value)}
                placeholder="Nome associado à chave"
              />
            </div>
            
            <div>
              <Label htmlFor={`bank-${key.id}`}>Banco</Label>
              <Input
                id={`bank-${key.id}`}
                value={key.bank_name || ""}
                onChange={(e) => handleKeyChange(key.id, 'bank_name', e.target.value)}
                placeholder="Nome do banco"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={key.isDefault}
                onCheckedChange={() => handleSetDefault(key.id)}
                id={`default-${key.id}`}
              />
              <Label htmlFor={`default-${key.id}`}>Definir como chave principal</Label>
            </div>
            
            <Button
              onClick={() => handleSavePixKey(key)}
              size="sm"
            >
              <Check className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      ))}
      
      <Button onClick={handleAddPixKey} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar chave PIX
      </Button>
    </div>
  );
}
