
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UsersTab } from "@/components/admin/settings/UsersTab";
import { SystemTab } from "@/components/admin/settings/SystemTab";
import { RoleChangeModal } from "@/components/admin/settings/RoleChangeModal";
import { UserRole } from "@/types";

// Update ProfileData interface to accept string for role
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
  const [activeTab, setActiveTab] = useState("usuarios");
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);
  const [newRole, setNewRole] = useState<string>("");
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
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="usuarios" className="mt-6">
          <UsersTab openRoleModal={openRoleModal} />
        </TabsContent>
        
        {/* System Tab */}
        <TabsContent value="sistema" className="mt-6">
          <SystemTab />
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
