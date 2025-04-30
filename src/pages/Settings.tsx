
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PixKeysManager from "@/components/settings/PixKeysManager";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

// Define the PixKey type to match what's coming from the database
interface PixKey {
  id: string;
  user_id: string;
  type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";
  key: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  bank_name?: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("geral");
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPixKeys = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our PixKey interface
      const transformedData: PixKey[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        type: item.type,
        key: item.key,
        name: item.name,
        is_default: item.is_default || false,
        created_at: item.created_at,
        updated_at: item.updated_at,
        bank_name: item.bank_name || "",
      }));

      setPixKeys(transformedData);
    } catch (err: any) {
      toast({
        title: "Erro ao carregar chaves Pix",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPixKey = async (newKey: Partial<PixKey>) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .insert([{
          user_id: user.id,
          type: newKey.type,
          key: newKey.key,
          name: newKey.name,
          is_default: newKey.is_default || false,
          bank_name: newKey.bank_name || "",
        }])
        .select();

      if (error) throw error;

      // Transform the newly created key to match our interface
      const transformedKey: PixKey = {
        id: data[0].id,
        user_id: data[0].user_id,
        type: data[0].type,
        key: data[0].key,
        name: data[0].name,
        is_default: data[0].is_default || false,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at,
        bank_name: data[0].bank_name || "",
      };

      setPixKeys(prev => [transformedKey, ...prev]);
      toast({
        title: "Chave Pix adicionada",
        description: "Sua nova chave Pix foi adicionada com sucesso."
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao adicionar chave Pix",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeletePixKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPixKeys(prev => prev.filter(key => key.id !== id));
      toast({
        title: "Chave Pix removida",
        description: "A chave Pix foi removida com sucesso."
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao remover chave Pix",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPixKeys();
  }, [user]);

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Configurações</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="pix">Chaves Pix</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral" className="space-y-4">
            <div className="grid gap-4">
              <h2 className="text-xl font-medium">Configurações Gerais</h2>
              <p className="text-gray-500">Configurações básicas da conta e preferências.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="pix" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-medium">Suas Chaves Pix</h2>
                <p className="text-gray-500">Gerencie suas chaves Pix para recebimento de pagamentos.</p>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nova Chave
              </Button>
            </div>
            
            <PixKeysManager 
              keys={pixKeys}
              isLoading={isLoading}
              onAdd={handleAddPixKey}
              onDelete={handleDeletePixKey}
            />
          </TabsContent>
          
          <TabsContent value="notificacoes" className="space-y-4">
            <h2 className="text-xl font-medium">Notificações</h2>
            <p className="text-gray-500">Configure como deseja ser notificado.</p>
          </TabsContent>
          
          <TabsContent value="seguranca" className="space-y-4">
            <h2 className="text-xl font-medium">Segurança</h2>
            <p className="text-gray-500">Defina opções de segurança para sua conta.</p>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
