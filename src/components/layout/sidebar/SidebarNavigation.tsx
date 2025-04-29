
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
  CreditCard
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { SidebarItem } from "./types";

interface SidebarNavigationProps {
  userRole: UserRole;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Vendas",
      icon: ListOrdered,
      href: "/sales",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Clientes",
      icon: Users,
      href: "/clients",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
      subItems: [
        {
          title: "Máquinas",
          href: "/machines",
          roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
        }
      ]
    },
    {
      title: "Parceiros",
      icon: Users,
      href: "/partners",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL],
    },
    {
      title: "Pagamentos",
      icon: Wallet,
      href: "/payments",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL],
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: "/reports",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Taxas",
      icon: Percent,
      href: "/fees",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL],
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: "/support",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/settings",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
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
