
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import SidebarNavItem from "./SidebarNavItem";
import { 
  Home, 
  Users, 
  Settings, 
  Wallet, 
  BarChart3, 
  Package, 
  HelpCircle, 
  Bell,
  LayoutGrid,
  UserPlus,
  Truck,
  ArrowRightLeft,
  CreditCard,
  User
} from "lucide-react";
import { PATHS } from "@/routes/paths";
import { useState } from "react";
import { UserRole } from "@/types";
import { SidebarItem } from "./types";

interface SidebarNavigationProps {
  userRole: UserRole;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
  const location = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  
  const handleToggle = (key: string) => {
    setOpen(prev => prev === key ? null : key);
  };

  // Create sidebar items based on user role
  const getAdminItems = (): SidebarItem[] => {
    return [
      {
        title: "Dashboard",
        icon: Home,
        href: PATHS.ADMIN.DASHBOARD,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Clientes",
        icon: Users,
        href: PATHS.ADMIN.CLIENTS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Parceiros",
        icon: UserPlus,
        href: PATHS.ADMIN.PARTNERS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Pagamentos",
        icon: CreditCard,
        href: PATHS.ADMIN.PAYMENTS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Vendas",
        icon: BarChart3,
        href: PATHS.ADMIN.SALES,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Taxas",
        icon: Package,
        href: PATHS.ADMIN.FEES,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Notificações",
        icon: Bell,
        href: PATHS.ADMIN.NOTIFICATIONS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Logística",
        icon: Truck,
        href: PATHS.LOGISTICS.OPERATIONS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Relatórios",
        icon: BarChart3,
        href: PATHS.ADMIN.REPORTS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Configurações",
        icon: Settings,
        href: PATHS.ADMIN.SETTINGS,
        roles: [UserRole.ADMIN],
      },
    ];
  };

  const getClientItems = (): SidebarItem[] => {
    return [
      {
        title: "Dashboard",
        icon: Home,
        href: PATHS.USER.DASHBOARD,
        roles: [UserRole.CLIENT],
      },
      {
        title: "Máquinas",
        icon: Package,
        href: PATHS.USER.MACHINES,
        roles: [UserRole.CLIENT],
      },
      {
        title: "Pagamentos",
        icon: Wallet,
        href: PATHS.USER.PAYMENTS,
        roles: [UserRole.CLIENT],
      },
      {
        title: "Suporte",
        icon: HelpCircle,
        href: PATHS.USER.SUPPORT,
        roles: [UserRole.CLIENT],
      },
    ];
  };

  const getPartnerItems = (): SidebarItem[] => {
    return [
      {
        title: "Dashboard",
        icon: Home,
        href: PATHS.PARTNER.DASHBOARD,
        roles: [UserRole.PARTNER],
      },
      {
        title: "Clientes",
        icon: Users,
        href: PATHS.PARTNER.CLIENTS,
        roles: [UserRole.PARTNER],
      },
      {
        title: "Comissões",
        icon: Wallet,
        href: PATHS.PARTNER.COMMISSIONS,
        roles: [UserRole.PARTNER],
      },
      {
        title: "Configurações",
        icon: Settings,
        href: PATHS.PARTNER.SETTINGS,
        roles: [UserRole.PARTNER],
      },
    ];
  };

  const getFinancialItems = (): SidebarItem[] => {
    return [
      {
        title: "Dashboard",
        icon: Home,
        href: PATHS.FINANCIAL.DASHBOARD,
        roles: [UserRole.FINANCIAL],
      },
      {
        title: "Solicitações",
        icon: ArrowRightLeft,
        href: PATHS.FINANCIAL.REQUESTS,
        roles: [UserRole.FINANCIAL],
      },
      {
        title: "Relatórios",
        icon: BarChart3,
        href: PATHS.FINANCIAL.REPORTS,
        roles: [UserRole.FINANCIAL],
      },
    ];
  };

  const getLogisticsItems = (): SidebarItem[] => {
    return [
      {
        title: "Dashboard",
        icon: Home,
        href: PATHS.LOGISTICS.DASHBOARD,
        roles: [UserRole.LOGISTICS],
      },
      {
        title: "Máquinas",
        icon: Package,
        href: PATHS.LOGISTICS.MACHINES,
        roles: [UserRole.LOGISTICS],
      },
      {
        title: "Operações",
        icon: Truck,
        href: PATHS.LOGISTICS.OPERATIONS,
        roles: [UserRole.LOGISTICS],
      },
      {
        title: "Suporte",
        icon: HelpCircle,
        href: PATHS.LOGISTICS.SUPPORT,
        roles: [UserRole.LOGISTICS],
      },
    ];
  };

  // Get items based on user role
  const getRoleItems = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return getAdminItems();
      case UserRole.CLIENT:
        return getClientItems();
      case UserRole.PARTNER:
        return getPartnerItems();
      case UserRole.FINANCIAL:
        return getFinancialItems();
      case UserRole.LOGISTICS:
        return getLogisticsItems();
      default:
        return [];
    }
  };

  const navigationItems = getRoleItems();

  return (
    <div className="space-y-1 py-2">
      {navigationItems.map((item) => (
        <SidebarNavItem 
          key={item.title} 
          item={item} 
          userRole={userRole} 
        />
      ))}
    </div>
  );
};

export default SidebarNavigation;
