
import { LayoutDashboard, ListOrdered, Building2, CreditCard, Users, Percent, BarChart3, MessageSquare, HelpCircle, Settings } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const financialItems: SidebarItem[] = [
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
