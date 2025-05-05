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
  HelpCircle,
  Truck
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { SidebarItem } from "./types";
import { PATHS } from "@/routes/paths";

interface SidebarNavigationProps {
  userRole: UserRole;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
  // Define role-specific items
  const adminItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: PATHS.ADMIN.DASHBOARD,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Vendas",
      icon: ListOrdered,
      href: PATHS.ADMIN.SALES,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Pagamentos",
      icon: Wallet,
      href: PATHS.ADMIN.PAYMENTS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL],
    },
    {
      title: "Clientes",
      icon: Building2,
      href: PATHS.ADMIN.CLIENTS,
      roles: [UserRole.ADMIN],
      subItems: [
        {
          title: "Lista de Clientes",
          href: PATHS.ADMIN.CLIENTS,
          roles: [UserRole.ADMIN],
        },
        {
          title: "Máquinas",
          href: PATHS.ADMIN.MACHINES,
          roles: [UserRole.ADMIN],
        }
      ]
    },
    {
      title: "Parceiros",
      icon: Users,
      href: PATHS.ADMIN.PARTNERS,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Logística",
      icon: Truck,
      href: PATHS.ADMIN.LOGISTICS,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: PATHS.ADMIN.REPORTS,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Taxas",
      icon: Percent,
      href: PATHS.ADMIN.FEES,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: PATHS.ADMIN.SUPPORT,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: PATHS.ADMIN.HELP,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: PATHS.ADMIN.SETTINGS,
      roles: [UserRole.ADMIN],
    },
  ];

  const userItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: PATHS.USER.DASHBOARD,
      roles: [UserRole.CLIENT],
    },
    {
      title: "Meus Pagamentos",
      icon: Wallet,
      href: PATHS.USER.PAYMENTS,
      roles: [UserRole.CLIENT]
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: PATHS.USER.SUPPORT,
      roles: [UserRole.CLIENT],
    },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: PATHS.USER.HELP,
      roles: [UserRole.CLIENT],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: PATHS.USER.SETTINGS,
      roles: [UserRole.CLIENT],
    },
  ];

  const partnerItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: PATHS.PARTNER.DASHBOARD,
      roles: [UserRole.PARTNER],
    },
    {
      title: "Vendas",
      icon: ListOrdered,
      href: PATHS.PARTNER.SALES,
      roles: [UserRole.PARTNER],
    },
    {
      title: "Clientes",
      icon: Building2,
      href: PATHS.PARTNER.CLIENTS,
      roles: [UserRole.PARTNER],
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: PATHS.PARTNER.REPORTS,
      roles: [UserRole.PARTNER],
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: PATHS.PARTNER.SUPPORT,
      roles: [UserRole.PARTNER],
    },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: PATHS.PARTNER.HELP,
      roles: [UserRole.PARTNER],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: PATHS.PARTNER.SETTINGS,
      roles: [UserRole.PARTNER],
    },
  ];

  const financialItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: PATHS.FINANCIAL.DASHBOARD,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Vendas",
      icon: ListOrdered,
      href: PATHS.FINANCIAL.SALES,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Clientes",
      icon: Building2,
      href: PATHS.FINANCIAL.CLIENTS,
      roles: [UserRole.FINANCIAL],
      subItems: [
        {
          title: "Lista de Clientes",
          href: PATHS.FINANCIAL.CLIENTS,
          roles: [UserRole.FINANCIAL],
        },
      ]
    },
    {
      title: "Pagamentos",
      icon: CreditCard,
      href: PATHS.FINANCIAL.PAYMENTS,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Parceiros",
      icon: Users,
      href: PATHS.FINANCIAL.PARTNERS,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Taxas",
      icon: Percent,
      href: PATHS.FINANCIAL.FEES,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: PATHS.FINANCIAL.REPORTS,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: PATHS.FINANCIAL.SUPPORT,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: PATHS.FINANCIAL.HELP,
      roles: [UserRole.FINANCIAL],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: PATHS.FINANCIAL.SETTINGS,
      roles: [UserRole.FINANCIAL],
    },
  ];

  const logisticsItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: PATHS.LOGISTICS.DASHBOARD,
      roles: [UserRole.LOGISTICS],
    },
    {
      title: "Clientes",
      icon: Building2,
      href: PATHS.LOGISTICS.CLIENTS,
      roles: [UserRole.LOGISTICS],
    },
    {
      title: "Máquinas",
      icon: CreditCard,
      href: PATHS.LOGISTICS.MACHINES,
      roles: [UserRole.LOGISTICS],
    },
    {
      title: "Vendas",
      icon: ListOrdered,
      href: PATHS.LOGISTICS.SALES,
      roles: [UserRole.LOGISTICS],
    },
    {
      title: "Operações",
      icon: Truck,
      href: PATHS.LOGISTICS.LOGISTICS_MODULE,
      roles: [UserRole.LOGISTICS],
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: PATHS.LOGISTICS.SUPPORT,
      roles: [UserRole.LOGISTICS],
    },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: PATHS.LOGISTICS.HELP,
      roles: [UserRole.LOGISTICS],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: PATHS.LOGISTICS.SETTINGS,
      roles: [UserRole.LOGISTICS],
    },
  ];

  // Get items based on user role
  let sidebarItems: SidebarItem[] = [];
  
  switch (userRole) {
    case UserRole.ADMIN:
      sidebarItems = adminItems;
      break;
    case UserRole.CLIENT:
      sidebarItems = userItems;
      break;
    case UserRole.PARTNER:
      sidebarItems = partnerItems;
      break;
    case UserRole.FINANCIAL:
      sidebarItems = financialItems;
      break;
    case UserRole.LOGISTICS:
      sidebarItems = logisticsItems;
      break;
    default:
      sidebarItems = userItems; // Default to user items
  }

  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => (
        <div key={item.title}>
          <SidebarNavItem item={item} userRole={userRole} />
        </div>
      ))}
    </nav>
  );
};

export default SidebarNavigation;
