
import { LayoutDashboard, Truck, MessageSquare, Box, Building2, Settings, FileText } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const logisticsItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.LOGISTICS.DASHBOARD,
    roles: [UserRole.LOGISTICS, UserRole.ADMIN],
  },
  {
    title: "Máquinas",
    icon: Box,
    href: PATHS.LOGISTICS.MACHINES,
    roles: [UserRole.LOGISTICS, UserRole.ADMIN],
  },
  {
    title: "Operações",
    icon: Truck,
    href: PATHS.LOGISTICS.OPERATIONS,
    roles: [UserRole.LOGISTICS, UserRole.ADMIN],
  },
  {
    title: "Solicitações e Suporte",
    icon: MessageSquare,
    href: PATHS.LOGISTICS.REQUESTS,
    roles: [UserRole.LOGISTICS, UserRole.ADMIN],
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: PATHS.LOGISTICS.REPORTS,
    roles: [UserRole.LOGISTICS, UserRole.ADMIN],
  },
  {
    title: "Clientes",
    icon: Building2,
    href: PATHS.LOGISTICS.CLIENTS,
    roles: [UserRole.LOGISTICS, UserRole.ADMIN],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: PATHS.LOGISTICS.SETTINGS,
    roles: [UserRole.LOGISTICS, UserRole.ADMIN],
  },
];
