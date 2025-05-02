
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  ListOrdered,
  Wallet,
  Settings,
  Users,
  BarChart3,
  MessageSquare,
  Percent,
  CreditCard,
  Building2,
  Truck
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { SidebarItem } from "./types";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

interface SidebarNavigationProps {
  userRole: UserRole;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
  const navigate = useNavigate();

  const getRoleSpecificDashboardPath = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return PATHS.ADMIN.DASHBOARD;
      case UserRole.CLIENT:
        return PATHS.USER.DASHBOARD;
      case UserRole.FINANCIAL:
        return PATHS.FINANCIAL.DASHBOARD;
      case UserRole.PARTNER:
        return PATHS.PARTNER.DASHBOARD;
      case UserRole.LOGISTICS:
        return PATHS.LOGISTICS.DASHBOARD;
      default:
        return PATHS.LOGIN;
    }
  };

  const handleDashboardClick = () => {
    navigate(getRoleSpecificDashboardPath());
  };

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: getRoleSpecificDashboardPath(),
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    },
  ];

  if (userRole === UserRole.ADMIN) {
    sidebarItems.push(
      {
        title: "Painel Admin",
        icon: Settings,
        href: PATHS.ADMIN.DASHBOARD,
        roles: [UserRole.ADMIN],
      }
    );
  } else if (userRole === UserRole.FINANCIAL) {
    sidebarItems.push(
      {
        title: "Painel Financeiro",
        icon: CreditCard,
        href: PATHS.FINANCIAL.DASHBOARD,
        roles: [UserRole.FINANCIAL],
      }
    );
  } else if (userRole === UserRole.PARTNER) {
    sidebarItems.push(
      {
        title: "Painel de Parceiro",
        icon: Users,
        href: PATHS.PARTNER.DASHBOARD,
        roles: [UserRole.PARTNER],
      }
    );
  } else if (userRole === UserRole.LOGISTICS) {
    sidebarItems.push(
      {
        title: "Painel de Logística",
        icon: Truck,
        href: PATHS.LOGISTICS.DASHBOARD,
        roles: [UserRole.LOGISTICS],
      }
    );
  } else if (userRole === UserRole.CLIENT) {
    sidebarItems.push(
      {
        title: "Área do Cliente",
        icon: Building2,
        href: PATHS.USER.DASHBOARD,
        roles: [UserRole.CLIENT],
      }
    );
  }

  // Common items for all roles
  sidebarItems.push(
    {
      title: "Suporte",
      icon: MessageSquare,
      href: userRole === UserRole.ADMIN ? PATHS.ADMIN.SUPPORT :
            userRole === UserRole.CLIENT ? PATHS.USER.SUPPORT :
            userRole === UserRole.FINANCIAL ? PATHS.FINANCIAL.SUPPORT :
            userRole === UserRole.PARTNER ? PATHS.PARTNER.SUPPORT :
            PATHS.LOGISTICS.SUPPORT,
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: userRole === UserRole.ADMIN ? PATHS.ADMIN.SETTINGS :
            userRole === UserRole.CLIENT ? PATHS.USER.SETTINGS :
            userRole === UserRole.FINANCIAL ? PATHS.FINANCIAL.SETTINGS :
            userRole === UserRole.PARTNER ? PATHS.PARTNER.SETTINGS :
            PATHS.LOGISTICS.SETTINGS,
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    }
  );

  const filteredItems = sidebarItems.filter((item) => 
    item.roles.includes(userRole)
  );

  return (
    <nav className="space-y-1">
      {filteredItems.map((item) => (
        <div key={item.title}>
          <SidebarNavItem item={item} userRole={userRole} />
        </div>
      ))}
    </nav>
  );
};

export default SidebarNavigation;
