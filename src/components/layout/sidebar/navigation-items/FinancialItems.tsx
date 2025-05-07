
import { LayoutDashboard, CreditCard, Building2, BarChart3 } from "lucide-react";
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
    title: "Pagamentos",
    icon: CreditCard,
    href: PATHS.ADMIN.PAYMENTS, // Point to the admin payments page
    roles: [UserRole.FINANCIAL],
  },
  {
    title: "Clientes",
    icon: Building2,
    href: PATHS.FINANCIAL.CLIENTS,
    roles: [UserRole.FINANCIAL],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: PATHS.FINANCIAL.REPORTS,
    roles: [UserRole.FINANCIAL],
  },
];
