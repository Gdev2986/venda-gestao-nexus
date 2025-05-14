
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { AdminSecurityTab } from "@/components/admin/settings/AdminSecurityTab";
import { UsersTab } from "@/components/admin/settings/UsersTab";
import { SystemTab } from "@/components/admin/settings/SystemTab";
import { AdminNotificationsTab } from "@/components/admin/settings/AdminNotificationsTab";
import { RoleChangeModal } from "@/components/admin/settings/RoleChangeModal";
import { UserRole } from "@/types";

// Define the profile data with the correct UserRole type
interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export default function AdminSettings() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);
  
  const handleOpenRoleModal = (user: ProfileData) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };
  
  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedUser(null);
  };
  
  const handleRoleChange = async () => {
    if (!selectedUser) return;
    
    // Add your role change logic here
    console.log("Changing role of user", selectedUser.id, "to", selectedRole);
    
    // Close the modal after successful role change
    handleCloseRoleModal();
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações do Sistema" 
        description="Gerencie configurações globais, usuários e segurança" 
      />
      
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <UsersTab openRoleModal={handleOpenRoleModal} />
          </Card>
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
          user={selectedUser}
          newRole={selectedRole}
          setNewRole={setSelectedRole}
          onClose={handleCloseRoleModal}
          onSave={handleRoleChange}
        />
      )}
    </div>
  );
}
