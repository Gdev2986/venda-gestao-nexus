
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PixKey, UserSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createDefaultPixKeyProperties } from "@/utils/settings-utils";
import { loadSettings, saveSettings } from "@/utils/settings-utils";

const Settings = () => {
  const { user } = useAuth();
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    email: "",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    theme: "light" as const,
    notifications: {
      marketing: true,
      security: true,
    },
    display: {
      showBalance: true,
      showNotifications: true,
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        try {
          const result = await loadSettings();
          if (result.settings) {
            setUserSettings(result.settings);
          }
        } catch (error) {
          console.error("Error loading settings:", error);
        }
      }
    };

    fetchSettings();
  }, [user]);

  useEffect(() => {
    const fetchPixKeys = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const { data, error } = await supabase
            .from('pix_keys')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error("Error fetching pix keys:", error);
            toast({
              title: "Erro ao carregar chaves PIX",
              description: "Não foi possível carregar suas chaves PIX. Tente novamente mais tarde.",
              variant: "destructive",
            });
          } else {
            // Transform the data from the database to match our PixKey type
            const transformedKeys: PixKey[] = (data || []).map(item => ({
              id: item.id,
              user_id: item.user_id,
              key_type: item.type || "",
              type: item.type || "CPF",
              key: item.key || "",
              owner_name: item.name || "",
              name: item.name || "",
              isDefault: item.is_default || false,
              is_default: item.is_default || false,
              is_active: true,
              created_at: item.created_at,
              updated_at: item.updated_at,
              bank_name: "Banco", // Default value since it's not in the database
            }));
            
            setPixKeys(transformedKeys);
          }
        }
      } catch (error) {
        console.error("Error fetching pix keys:", error);
        toast({
          title: "Erro ao carregar chaves PIX",
          description: "Ocorreu um erro ao carregar suas chaves PIX. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPixKeys();
  }, [user, toast]);

  const handleSaveSettings = async () => {
    try {
      const result = await saveSettings(userSettings);
      if (result.success) {
        toast({
          title: "Configurações salvas",
          description: "Suas configurações foram salvas com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao salvar configurações",
          description: result.error || "Ocorreu um erro ao salvar suas configurações.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao salvar configurações",
        description: error.message || "Ocorreu um erro ao salvar suas configurações.",
        variant: "destructive",
      });
    }
  };

  const handleAddPixKey = async () => {
    if (!user) return;

    const newId = Date.now().toString();
    
    // Use the utility function to create a new PixKey object
    const newPixKey = createDefaultPixKeyProperties(newId, user.id);
    
    setPixKeys(prev => [...prev, newPixKey]);
  };

  // Render PixKeys component directly instead of using a separate component
  const renderPixKeys = () => {
    if (isLoading) {
      return <p>Carregando chaves PIX...</p>;
    }
    
    return (
      <div className="space-y-4">
        {pixKeys.map((key) => (
          <div key={key.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`key-${key.id}`}>Chave PIX</Label>
              <Input
                type="text"
                id={`key-${key.id}`}
                defaultValue={key.key}
                disabled
              />
            </div>
            <div>
              <Label htmlFor={`type-${key.id}`}>Tipo</Label>
              <Input
                type="text"
                id={`type-${key.id}`}
                defaultValue={key.type}
                disabled
              />
            </div>
            <div>
              <Label htmlFor={`bank-${key.id}`}>Banco</Label>
              <Input
                type="text"
                id={`bank-${key.id}`}
                defaultValue={key.bank_name}
                disabled
              />
            </div>
          </div>
        ))}
        <Button onClick={handleAddPixKey}>Adicionar Chave PIX</Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Gerencie suas configurações de conta e chaves PIX.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Preferências</h3>
            <div className="space-y-4">
              {/* Settings fields would go here */}
              <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Chaves PIX</h3>
            {renderPixKeys()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
