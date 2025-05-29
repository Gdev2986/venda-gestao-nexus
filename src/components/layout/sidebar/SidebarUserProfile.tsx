
import { memo } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/enums";

interface SidebarUserProfileProps {
  userRole: UserRole | null;
}

const SidebarUserProfile = memo(({ userRole }: SidebarUserProfileProps) => {
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log("SidebarUserProfile: Sign out clicked");
    
    try {
      await signOut();
    } catch (error) {
      console.error("SidebarUserProfile: Error during sign out:", error);
      // Force redirect even if signOut fails
      window.location.href = '/login';
    }
  };

  const userName = userProfile?.name || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="border-t border-sidebar-border p-3 md:p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start p-2 h-auto text-sidebar-foreground hover:bg-white/10"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile?.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

SidebarUserProfile.displayName = "SidebarUserProfile";

export default SidebarUserProfile;
