
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UsersTab } from "@/components/admin/settings/UsersTab";
import { SystemTab } from "@/components/admin/settings/SystemTab";
import { RoleChangeModal } from "@/components/admin/settings/RoleChangeModal";
import { AdminNotificationsTab } from "@/components/admin/settings/AdminNotificationsTab";
import { AdminSecurityTab } from "@/components/admin/settings/AdminSecurityTab";
import { UserRole } from "@/types";

// Update ProfileData interface to use UserRole for role
interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: string;  // Use string type instead of UserRole enum
  created_at: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);
  const [newRole, setNewRole] = useState<string>("CLIENT");  // Use string type
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const { toast } = useToast();

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Função atualizada",
        description: `A função de ${selectedUser.name} foi atualizada para ${newRole}.`
      });
      
      setShowRoleModal(false);
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar função",
        description: "Não foi possível atualizar a função do usuário."
      });
    }
  };

  const openRoleModal = (user: ProfileData) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 overflow-x-auto flex whitespace-nowrap sm:inline-flex">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="usuarios" className="mt-6">
          <UsersTab openRoleModal={openRoleModal} />
        </TabsContent>
        
        {/* System Tab */}
        <TabsContent value="sistema" className="mt-6">
          <SystemTab />
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notificacoes" className="mt-6">
          <AdminNotificationsTab />
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="seguranca" className="mt-6">
          <AdminSecurityTab />
        </TabsContent>
      </Tabs>
      
      {/* Role Modal */}
      {showRoleModal && selectedUser && (
        <RoleChangeModal
          user={selectedUser}
          newRole={newRole}
          setNewRole={setNewRole}
          onClose={() => setShowRoleModal(false)}
          onSave={handleRoleChange}
        />
      )}
    </div>
  );
};

export default AdminSettings;
