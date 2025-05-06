
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PersonalDataForm } from "@/components/settings/PersonalDataForm";
import { PixKeysManager } from "@/components/settings/PixKeysManager";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Configurações</h1>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="pix">Chaves PIX</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalDataForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pix">
          <Card>
            <CardHeader>
              <CardTitle>Chaves PIX</CardTitle>
              <CardDescription>
                Gerencie suas chaves PIX para recebimento de pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PixKeysManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure como deseja receber notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreferences />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
