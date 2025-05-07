
import { LayoutDashboard, CreditCard, Truck, MessageSquare, Calendar, Box, Building2, ListOrdered, HelpCircle, Settings } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const logisticsItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.LOGISTICS.DASHBOARD,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Máquinas",
    icon: CreditCard,
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
    title: "Solicitações",
    icon: MessageSquare,
    href: PATHS.LOGISTICS.REQUESTS,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Calendário",
    icon: Calendar,
    href: PATHS.LOGISTICS.CALENDAR,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Inventário",
    icon: Box,
    href: PATHS.LOGISTICS.INVENTORY,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Clientes",
    icon: Building2,
    href: PATHS.LOGISTICS.CLIENTS,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Vendas",
    icon: ListOrdered,
    href: PATHS.LOGISTICS.SALES,
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
