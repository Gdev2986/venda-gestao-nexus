
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ShoppingCart,
  FileText,
  Settings,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export const partnerItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.PARTNER.DASHBOARD,
    roles: [UserRole.PARTNER],
  },
  {
    title: "Meus Clientes",
    icon: Users,
    href: PATHS.PARTNER.CLIENTS,
    roles: [UserRole.PARTNER],
  },
  {
    title: "Comissões",
    icon: DollarSign,
    href: PATHS.PARTNER.COMMISSIONS,
    roles: [UserRole.PARTNER],
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    href: PATHS.PARTNER.SALES,
    roles: [UserRole.PARTNER],
  },
  {
    title: "Relatórios",
    icon: FileText,
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
    href: PATHS.PARTNER.SUPPORT,
    roles: [UserRole.PARTNER],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: PATHS.PARTNER.SETTINGS,
    roles: [UserRole.PARTNER],
  },
];
