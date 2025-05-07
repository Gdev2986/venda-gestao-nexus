
import { useState } from "react";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PageHeader } from "@/components/page/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PersonalDataForm } from "@/components/settings/PersonalDataForm";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import SecuritySettings from "@/components/settings/SecuritySettings";
import { SendNotification } from "@/components/settings/SendNotification";

const LogisticsSettings = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <PageWrapper>
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas preferências e dados pessoais"
      />
      
      <div className="grid gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          {/* Personal Data Form */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais e informações de contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalDataForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          
          {/* Notification Preferences */}
          <TabsContent value="notifications">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {/* Notification Preferences */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Preferências de Notificações</CardTitle>
                  <CardDescription>
                    Controle quais notificações você deseja receber
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationPreferences />
                </CardContent>
              </Card>
              
              {/* Send Notifications */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Enviar Notificações</CardTitle>
                  <CardDescription>
                    Envie notificações personalizadas para clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SendNotification />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default LogisticsSettings;
