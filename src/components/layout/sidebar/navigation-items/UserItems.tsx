
import { LayoutDashboard, Wallet, MessageSquare, HelpCircle, Settings } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const userItems: SidebarItem[] = [
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
