import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { AdminProfile } from "@/components/admin/settings/AdminProfile";
import AdminNotificationsTab from "@/components/admin/settings/AdminNotificationsTab";
import UsersTab from "@/components/admin/settings/UsersTab";

const AdminSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
      setRole(user.user_metadata?.role || "");
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      if (!name || !email) {
        toast({
          title: "Erro",
          description: "Nome e email são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Convert the string role to UserRole type
      const userRoleTyped = role as UserRole;

      // Update user profile
      await updateUserProfile({
        name: name,
        email: email,
        role: userRoleTyped,
      });

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações da sua conta e do sistema"
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="space-y-4">
              <AdminProfile
                name={name}
                email={email}
                role={role}
                setName={setName}
                setEmail={setEmail}
                setRole={setRole}
                isSaving={isSaving}
                onProfileUpdate={handleProfileUpdate}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent>
              <AdminNotificationsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent>
              <UsersTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
