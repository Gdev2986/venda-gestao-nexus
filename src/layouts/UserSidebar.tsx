
import { memo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  Settings, 
  X,
  Truck,
  MessageSquare,
  BarChart3,
  Wallet,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

interface UserSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const UserSidebar = memo(({ isOpen, isMobile, onClose }: UserSidebarProps) => {
  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="w-5 h-5 mr-3" />,
      href: PATHS.USER.DASHBOARD,
    },
    {
      label: "Máquinas",
      icon: <Truck className="w-5 h-5 mr-3" />,
      href: PATHS.USER.MACHINES,
    },
    {
      label: "Meus Pagamentos",
      icon: <Wallet className="w-5 h-5 mr-3" />,
      href: PATHS.USER.PAYMENTS,
    },
    {
      label: "Relatórios",
      icon: <BarChart3 className="w-5 h-5 mr-3" />,
      href: PATHS.USER.REPORTS,
    },
    {
      label: "Suporte",
      icon: <MessageSquare className="w-5 h-5 mr-3" />,
      href: PATHS.USER.SUPPORT,
    },
    {
      label: "Perfil",
      icon: <User className="w-5 h-5 mr-3" />,
      href: PATHS.USER.PROFILE,
    },
    {
      label: "Configurações",
      icon: <Settings className="w-5 h-5 mr-3" />,
      href: PATHS.USER.SETTINGS,
    }
  ];

  return (
    <>
      {/* Mobile backdrop with animation */}
      {isMobile && isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      {/* User Sidebar with fixed position and animation */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              SP
            </div>
            <span className="text-lg font-semibold">Área do Cliente</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-blue-800"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-blue-800 text-white" 
                      : "text-gray-300 hover:bg-blue-800 hover:text-white"
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="text-xs text-gray-400">
            <p>SigmaPay Cliente v1.0</p>
          </div>
        </div>
      </div>
    </>
  );
});

UserSidebar.displayName = "UserSidebar";

export default UserSidebar;
