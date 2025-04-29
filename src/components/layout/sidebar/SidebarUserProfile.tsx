
import { useEffect, useState } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SidebarUserProfileProps {
  userRole: UserRole;
}

const SidebarUserProfile = ({ userRole }: SidebarUserProfileProps) => {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState<string>("");
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, avatar')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
          return;
        }

        if (data) {
          setProfileName(data.name || "Usuário");
          setProfileAvatar(data.avatar);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Iniciais do nome para o avatar
  const getInitials = () => {
    if (profileName) {
      return profileName.charAt(0).toUpperCase();
    }
    return userRole.charAt(0);
  };

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-white">
          {profileAvatar ? (
            <img 
              src={profileAvatar} 
              alt={profileName} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getInitials()
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium truncate">{profileName || `Conta ${userRole}`}</p>
          <p className="text-xs text-sidebar-foreground/70 truncate">
            {userRole === UserRole.ADMIN && "Administrador"}
            {userRole === UserRole.CLIENT && "Cliente"}
            {userRole === UserRole.FINANCIAL && "Financeiro"}
            {userRole === UserRole.PARTNER && "Parceiro"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
