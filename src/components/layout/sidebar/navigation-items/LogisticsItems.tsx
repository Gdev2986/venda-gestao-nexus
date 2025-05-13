
import {
  LayoutDashboard,
  Settings,
  Package,
  Truck,
  ClipboardList,
  Calendar,
  DatabaseIcon,
  Layers,
  Users,
  MessageSquare,
} from "lucide-react";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";
import { SidebarItem } from "../types";

export const logisticsItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.LOGISTICS.DASHBOARD,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Máquinas",
    icon: Package,
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
    icon: ClipboardList,
    href: PATHS.LOGISTICS.REQUESTS,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Agenda",
    icon: Calendar,
    href: PATHS.LOGISTICS.CALENDAR,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Estoque",
    icon: Layers,
    href: PATHS.LOGISTICS.STOCK,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Clientes",
    icon: Users,
    href: PATHS.LOGISTICS.CLIENTS,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Suporte",
    icon: MessageSquare,
    href: PATHS.LOGISTICS.SUPPORT,
    roles: [UserRole.LOGISTICS],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: PATHS.LOGISTICS.SETTINGS,
    roles: [UserRole.LOGISTICS],
  },
];
