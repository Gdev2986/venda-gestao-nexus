
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemTab } from "@/components/admin/settings/SystemTab";
import { AdminSecurityTab } from "@/components/admin/settings/AdminSecurityTab";
import { AdminNotificationsTab } from "@/components/admin/settings/AdminNotificationsTab";
import { UsersTab } from "@/components/admin/settings/UsersTab";
import { RoleChangeModal } from "@/components/admin/settings/RoleChangeModal";

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

  // User role types as they are in the database
  type ValidUserRole = "ADMIN" | "CLIENT" | "FINANCIAL" | "PARTNER" | "LOGISTICS";

  const openRoleModal = (user: ProfileData) => {
    setSelectedUser(user);
    setIsRoleChangeModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie configurações do sistema, segurança e notificações
          </p>
        </div>
      </div>

      <Tabs defaultValue="users">
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

      {selectedUser && (
        <RoleChangeModal
          isOpen={isRoleChangeModalOpen}
          onClose={() => setIsRoleChangeModalOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default AdminSettings;
