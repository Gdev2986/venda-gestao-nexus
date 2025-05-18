
import { useEffect, useState } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Safely get initials from the name, handling possible undefined values
  const getInitials = () => {
    if (profileName && profileName.length > 0) {
      return profileName.charAt(0).toUpperCase();
    }
    
    // If no profile name, use the first letter of the role as fallback
    if (userRole && typeof userRole === 'string') {
      return userRole.charAt(0).toUpperCase();
    }
    
    // Ultimate fallback
    return "U";
  };

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 bg-sidebar-accent text-white">
          {profileAvatar ? (
            <AvatarImage 
              src={profileAvatar} 
              alt={profileName || "User profile"} 
            />
          ) : (
            <AvatarFallback className="bg-sidebar-accent text-white">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-3">
          <p className="text-sm font-medium truncate">{profileName || `Conta ${userRole}`}</p>
          <p className="text-xs text-sidebar-foreground/70 truncate">
            {userRole === UserRole.ADMIN && "Administrador"}
            {userRole === UserRole.CLIENT && "Cliente"}
            {userRole === UserRole.FINANCIAL && "Financeiro"}
            {userRole === UserRole.PARTNER && "Parceiro"}
            {userRole === UserRole.LOGISTICS && "Logística"}
            {userRole === UserRole.USER && "Usuário"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
