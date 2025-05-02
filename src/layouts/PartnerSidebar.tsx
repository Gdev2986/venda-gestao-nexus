
import { memo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  Settings, 
  X,
  MessageSquare,
  BarChart3,
  Building2,
  ListOrdered,
  CreditCard,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PATHS } from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

interface PartnerSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const PartnerSidebar = memo(({ isOpen, isMobile, onClose }: PartnerSidebarProps) => {
  const { signOut, user } = useAuth();
  
  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="w-5 h-5 mr-3" />,
      href: PATHS.PARTNER.DASHBOARD,
    },
    {
      label: "Meus Clientes",
      icon: <Building2 className="w-5 h-5 mr-3" />,
      href: PATHS.PARTNER.CLIENTS,
    },
    {
      label: "Vendas",
      icon: <ListOrdered className="w-5 h-5 mr-3" />,
      href: PATHS.PARTNER.SALES,
    },
    {
      label: "Comissões",
      icon: <CreditCard className="w-5 h-5 mr-3" />,
      href: PATHS.PARTNER.COMMISSIONS,
    },
    {
      label: "Relatórios",
      icon: <BarChart3 className="w-5 h-5 mr-3" />,
      href: PATHS.PARTNER.REPORTS,
    },
    {
      label: "Suporte",
      icon: <MessageSquare className="w-5 h-5 mr-3" />,
      href: PATHS.PARTNER.SUPPORT,
    },
    {
      label: "Configurações",
      icon: <Settings className="w-5 h-5 mr-3" />,
      href: PATHS.PARTNER.SETTINGS,
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
      
      {/* Partner Sidebar with fixed position and animation */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-green-900 text-white transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header - Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-green-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              SP
            </div>
            <span className="text-lg font-semibold">Área do Parceiro</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-green-800"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation section */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-green-800 text-white" 
                      : "text-gray-300 hover:bg-green-800 hover:text-white"
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

        {/* Logout section */}
        <div className="p-4 border-t border-green-800">
          <Separator className="my-2 bg-green-800" />
          <button
            onClick={signOut}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-green-800 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Sair</span>
          </button>
          <div className="text-xs text-gray-400 mt-4">
            <p>SigmaPay Parceiro v1.0</p>
          </div>
        </div>

        {/* User profile section */}
        <div className="p-4 border-t border-green-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Parceiro</p>
              <p className="text-xs text-gray-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

PartnerSidebar.displayName = "PartnerSidebar";

export default PartnerSidebar;
