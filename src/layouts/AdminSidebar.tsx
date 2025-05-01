
import { memo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  CreditCard, 
  Users, 
  Settings, 
  BarChart,
  FileText,
  X,
  Building2,
  Truck,
  MessageSquare,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

interface AdminSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const AdminSidebar = memo(({ isOpen, isMobile, onClose, userRole }: AdminSidebarProps) => {
  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.DASHBOARD,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL]
    },
    {
      label: "Solicitações de Pagamento",
      icon: <CreditCard className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.PAYMENT_REQUESTS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL]
    },
    {
      label: "Vendas",
      icon: <ShoppingBag className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.SALES,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL]
    },
    {
      label: "Clientes",
      icon: <Building2 className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.CLIENTS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL]
    },
    {
      label: "Parceiros",
      icon: <Users className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.PARTNERS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL]
    },
    {
      label: "Logística e Máquinas",
      icon: <Truck className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.LOGISTICS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.LOGISTICS]
    },
    {
      label: "Central de Suporte",
      icon: <MessageSquare className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.SUPPORT,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL]
    },
    {
      label: "Relatórios Financeiros",
      icon: <BarChart className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.FINANCIAL_REPORTS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL]
    },
    {
      label: "Configurações",
      icon: <Settings className="w-5 h-5 mr-3" />,
      href: PATHS.ADMIN.SETTINGS,
      roles: [UserRole.ADMIN]
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

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
      
      {/* Admin Sidebar with fixed position and animation */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              SP
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-slate-800 text-white" 
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
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

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-gray-400">
            <p>SigmaPay Admin v1.0</p>
          </div>
        </div>
      </div>
    </>
  );
});

AdminSidebar.displayName = "AdminSidebar";

export default AdminSidebar;
