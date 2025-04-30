
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/use-auth";
import { PixKey } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PixKeysManager from "@/components/settings/PixKeysManager";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchPixKeys();
    }
  }, [user?.id]);

  const fetchPixKeys = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("pix_keys")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Map the data to match our PixKey type if necessary
      const mappedKeys: PixKey[] = data.map(key => ({
        id: key.id,
        created_at: key.created_at,
        updated_at: key.updated_at || key.created_at,
        key: key.key,
        type: key.type,
        is_default: key.is_default || false,
        name: key.name,
        user_id: key.user_id
      }));

      setPixKeys(mappedKeys);
    } catch (error) {
      console.error("Error fetching PIX keys:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar suas chaves PIX.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPixKey = async (newKey: Partial<PixKey>): Promise<boolean> => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para adicionar uma chave PIX.",
        });
        return false;
      }

      // Ensure default key handling
      if (newKey.is_default) {
        // If this key is default, make all other keys not default
        await supabase
          .from("pix_keys")
          .update({ is_default: false })
          .eq("user_id", user.id);
      } else if (pixKeys.length === 0) {
        // If this is the first key, make it default
        newKey.is_default = true;
      }

      const { error } = await supabase.from("pix_keys").insert({
        key: newKey.key,
        type: newKey.type,
        name: newKey.name,
        is_default: newKey.is_default,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Chave PIX adicionada com sucesso.",
      });

      await fetchPixKeys();
      return true;
    } catch (error) {
      console.error("Error adding PIX key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar a chave PIX. Tente novamente.",
      });
      return false;
    }
  };

  const handleDeletePixKey = async (id: string): Promise<boolean> => {
    try {
      const keyToDelete = pixKeys.find(key => key.id === id);
      if (!keyToDelete) return false;

      const { error } = await supabase
        .from("pix_keys")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // If this was a default key and there are other keys, make the first one default
      if (keyToDelete.is_default && pixKeys.length > 1) {
        const nextKey = pixKeys.find(key => key.id !== id);
        if (nextKey) {
          await supabase
            .from("pix_keys")
            .update({ is_default: true })
            .eq("id", nextKey.id);
        }
      }

      toast({
        title: "Sucesso!",
        description: "Chave PIX removida com sucesso.",
      });

      await fetchPixKeys();
      return true;
    } catch (error) {
      console.error("Error deleting PIX key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a chave PIX. Tente novamente.",
      });
      return false;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>

        <Tabs defaultValue="pix_keys">
          <TabsList className="mb-4">
            <TabsTrigger value="pix_keys">Chaves PIX</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="pix_keys">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Chaves PIX</CardTitle>
                <CardDescription>
                  Configure suas chaves PIX para receber pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PixKeysManager 
                  isLoading={isLoading}
                  onAdd={handleAddPixKey}
                  onDelete={handleDeletePixKey}
                  pixKeys={pixKeys}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Gerencie seus dados pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configurações de perfil serão implementadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
