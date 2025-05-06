
import { LayoutDashboard, ListOrdered, Building2, BarChart3, MessageSquare, HelpCircle, Settings } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const partnerItems: SidebarItem[] = [
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
