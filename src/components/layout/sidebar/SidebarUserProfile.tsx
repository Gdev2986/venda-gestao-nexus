
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface SidebarUserProfileProps {
  userRole?: UserRole;
}

const SidebarUserProfile = ({ userRole = UserRole.CLIENT }: SidebarUserProfileProps) => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const userEmail = user.email || "";
  const userName = user.user_metadata?.name || userEmail.split("@")[0];

  const handleLogout = async () => {
    await signOut();
    navigate(PATHS.LOGIN);
  };

  const handleSettings = () => {
    let path = PATHS.USER.SETTINGS;
    
    switch (userRole) {
      case UserRole.ADMIN:
        path = PATHS.ADMIN.SETTINGS;
        break;
      case UserRole.FINANCIAL:
        path = PATHS.FINANCIAL.SETTINGS;
        break;
      case UserRole.PARTNER:
        path = PATHS.PARTNER.SETTINGS;
        break;
      case UserRole.LOGISTICS:
        path = PATHS.LOGISTICS.SETTINGS;
        break;
      case UserRole.CLIENT:
      default:
        path = PATHS.CLIENT.SETTINGS;
    }
    
    navigate(path);
  };

  return (
    <div className="border-t border-border p-4">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal flex items-center"
          >
            <div className="mr-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
              {userName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleSettings}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SidebarUserProfile;
