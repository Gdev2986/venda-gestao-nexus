
import { BarChart3, FileText } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const reportItems: SidebarItem[] = [
  {
    title: "Relatórios",
    icon: BarChart3,
    href: PATHS.ADMIN.REPORTS,
    roles: [UserRole.ADMIN, UserRole.FINANCIAL],
  },
  {
    title: "Relatórios Financeiros",
    icon: FileText,
    href: PATHS.FINANCIAL.REPORTS,
    roles: [UserRole.FINANCIAL],
  },
];
