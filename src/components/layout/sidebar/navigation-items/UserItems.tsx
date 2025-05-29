
import { LayoutDashboard, Wallet, MessageSquare, HelpCircle, Settings } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const userItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.CLIENT.DASHBOARD,
    roles: [UserRole.CLIENT],
  },
  {
    title: "Meus Pagamentos",
    icon: Wallet,
    href: PATHS.CLIENT.PAYMENTS,
    roles: [UserRole.CLIENT]
  },
  {
    title: "Suporte",
    icon: MessageSquare,
    href: PATHS.CLIENT.SUPPORT,
    roles: [UserRole.CLIENT],
  },
  {
    title: "Ajuda",
    icon: HelpCircle,
    href: PATHS.CLIENT.HELP,
    roles: [UserRole.CLIENT],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: PATHS.CLIENT.SETTINGS,
    roles: [UserRole.CLIENT],
  },
];
