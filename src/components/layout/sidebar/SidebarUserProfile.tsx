
import { UserRole } from "@/types";

interface SidebarUserProfileProps {
  userRole: UserRole;
}

const SidebarUserProfile = ({ userRole }: SidebarUserProfileProps) => {
  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-white">
          {userRole.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium truncate">Conta {userRole}</p>
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
