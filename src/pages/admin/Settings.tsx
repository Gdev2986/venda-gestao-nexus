
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { AdminProfile } from "@/components/admin/settings/AdminProfile";
import AdminNotificationsTab from "@/components/admin/settings/AdminNotificationsTab";
import UsersTab from "@/components/admin/settings/UsersTab";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [isSaving, setIsSaving] = useState(false);

  // Convert string role to UserRole enum
  const convertToUserRole = (roleStr: string | null | undefined): UserRole => {
    if (!roleStr) return UserRole.CLIENT;
    
    switch (roleStr.toUpperCase()) {
      case "ADMIN": return UserRole.ADMIN;
      case "CLIENT": return UserRole.CLIENT;
      case "PARTNER": return UserRole.PARTNER;
      case "FINANCIAL": return UserRole.FINANCIAL;
      case "LOGISTICS": return UserRole.LOGISTICS;
      default: return UserRole.CLIENT;
    }
  };

  useEffect(() => {
    console.log("AdminSettings: User loaded:", user);
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
      
      // Convert role string to UserRole enum
      const userRole = convertToUserRole(user.user_metadata?.role);
      setRole(userRole);
      console.log("AdminSettings: Role set to:", userRole);
    }
  }, [user]);

  const updateUserProfile = async ({
    name,
    email,
    role,
  }: {
    name: string;
    email: string;
    role: UserRole;
  }) => {
    try {
      console.log("Updating profile with role:", role);
      const { error } = await supabase.auth.updateUser({
        email,
        data: { name, role }
      });

      if (error) throw error;
      
      // Update profile table if needed
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ name, role })
          .eq('id', user.id);
          
        if (profileError) throw profileError;
      }
      
      return { success: true };
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  };

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

      // Update user profile
      await updateUserProfile({
        name: name,
        email: email,
        role: role,
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
                setRole={(roleValue: UserRole) => setRole(roleValue)}
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
