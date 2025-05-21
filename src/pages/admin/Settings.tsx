
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemTab } from "@/components/admin/settings/SystemTab";
import { AdminSecurityTab } from "@/components/admin/settings/AdminSecurityTab";
import AdminNotificationsTab from "@/components/admin/settings/AdminNotificationsTab";
import { UsersTab } from "@/components/admin/settings/UsersTab";
import { RoleChangeModal } from "@/components/admin/settings/RoleChangeModal";
import { PageHeader } from "@/components/page/PageHeader";
import { StyledCard } from "@/components/ui/styled-card";
import { Settings as SettingsIcon, Users, Shield, Bell, Cog } from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);

  const openRoleModal = (user: ProfileData) => {
    setSelectedUser(user);
    setIsRoleChangeModalOpen(true);
  };

  return (
    <div className="space-y-6 py-6">
      <PageHeader
        title="Configurações"
        description="Gerencie configurações do sistema, segurança e notificações"
        icon={<SettingsIcon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StyledCard 
          title="Usuários" 
          icon={<Users className="h-4 w-4 text-blue-500" />}
          borderColor="border-blue-500"
        >
          <div className="text-2xl font-bold">28</div>
          <p className="text-sm text-muted-foreground">Usuários ativos</p>
        </StyledCard>
        
        <StyledCard 
          title="Segurança" 
          icon={<Shield className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">12</div>
          <p className="text-sm text-muted-foreground">Políticas ativas</p>
        </StyledCard>
        
        <StyledCard 
          title="Notificações" 
          icon={<Bell className="h-4 w-4 text-orange-500" />}
          borderColor="border-orange-500"
        >
          <div className="text-2xl font-bold">5</div>
          <p className="text-sm text-muted-foreground">Canais configurados</p>
        </StyledCard>
        
        <StyledCard 
          title="Sistema" 
          icon={<Cog className="h-4 w-4 text-purple-500" />}
          borderColor="border-purple-500"
        >
          <div className="text-2xl font-bold">v1.2</div>
          <p className="text-sm text-muted-foreground">Versão atual</p>
        </StyledCard>
      </div>

      <StyledCard borderColor="border-gray-200">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersTab openRoleModal={openRoleModal} />
          </TabsContent>
          
          <TabsContent value="security">
            <AdminSecurityTab />
          </TabsContent>
          
          <TabsContent value="notifications">
            <AdminNotificationsTab />
          </TabsContent>
          
          <TabsContent value="system">
            <SystemTab />
          </TabsContent>
        </Tabs>
      </StyledCard>

      {selectedUser && (
        <RoleChangeModal
          open={isRoleChangeModalOpen}
          onClose={() => setIsRoleChangeModalOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default AdminSettings;
