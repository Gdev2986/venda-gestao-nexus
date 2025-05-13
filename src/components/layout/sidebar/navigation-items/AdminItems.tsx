
import { LayoutDashboard, ListOrdered, Wallet, Settings, Users, BarChart3, MessageSquare, Percent, Building2, Truck } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const adminItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.ADMIN.DASHBOARD,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Vendas",
    icon: ListOrdered,
    href: PATHS.ADMIN.SALES,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Pagamentos",
    icon: Wallet,
    href: PATHS.ADMIN.PAYMENTS,
    roles: [UserRole.ADMIN, UserRole.FINANCIAL],
  },
  {
    title: "Clientes",
    icon: Building2,
    href: PATHS.ADMIN.CLIENTS,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Parceiros",
    icon: Users,
    href: PATHS.ADMIN.PARTNERS,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Logística",
    icon: Truck,
    href: PATHS.ADMIN.LOGISTICS, // Using the correct path from PATHS
    roles: [UserRole.ADMIN],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: PATHS.ADMIN.REPORTS,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Taxas",
    icon: Percent,
    href: PATHS.ADMIN.FEES,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Suporte",
    icon: MessageSquare,
    href: PATHS.ADMIN.SUPPORT,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: PATHS.ADMIN.SETTINGS,
    roles: [UserRole.ADMIN],
  },
];
