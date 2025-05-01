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
  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: PATHS.DASHBOARD,
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    },
    {
      title: "Vendas",
      icon: ListOrdered,
      href: PATHS.SALES,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    },
    {
      title: "Clientes",
      icon: Building2,
      href: PATHS.CLIENTS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
      subItems: [
        {
          title: "Lista de Clientes",
          href: PATHS.CLIENTS,
          roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
        },
        {
          title: "Máquinas",
          href: PATHS.MACHINES,
          roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
        }
      ]
    },
    {
      title: "Parceiros",
      icon: Users,
      href: PATHS.PARTNERS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL],
    },
    {
      title: "Logística",
      icon: Truck,
      href: "/logistics",
      roles: [UserRole.ADMIN, UserRole.LOGISTICS],
    },
    // Changed to a simple button for CLIENT role and a dropdown for other roles
    {
      title: userRole === UserRole.CLIENT ? "Meus Pagamentos" : "Pagamentos",
      icon: Wallet,
      href: userRole === UserRole.CLIENT ? PATHS.USER_PAYMENTS : PATHS.PAYMENTS,
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL],
      // Only keep dropdown for non-client roles
      subItems: userRole !== UserRole.CLIENT ? [
        {
          title: "Todos os Pagamentos",
          href: PATHS.PAYMENTS,
          roles: [UserRole.ADMIN, UserRole.FINANCIAL],
        },
        {
          title: "Solicitações",
          href: PATHS.USER_PAYMENTS,
          roles: [UserRole.ADMIN, UserRole.FINANCIAL],
        }
      ] : []
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: PATHS.REPORTS,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Taxas",
      icon: Percent,
      href: PATHS.FEES,
      roles: [UserRole.ADMIN, UserRole.FINANCIAL],
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: PATHS.SUPPORT,
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: PATHS.HELP,
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: PATHS.SETTINGS,
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS],
    },
  ];

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
