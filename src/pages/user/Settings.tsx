
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonalDataForm } from "@/components/settings/PersonalDataForm";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalDataForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
