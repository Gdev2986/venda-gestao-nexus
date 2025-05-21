
import { Building2, BarChart3, FileText, Receipt } from "lucide-react";
import { SidebarItem } from "../types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const reportItems: SidebarItem[] = [
  {
    title: "Empresa",
    icon: Building2,
    href: PATHS.ADMIN.COMPANY,
    roles: [UserRole.ADMIN, UserRole.FINANCIAL],
    subItems: [
      {
        title: "Relatórios",
        href: PATHS.ADMIN.COMPANY_REPORTS,
        roles: [UserRole.ADMIN, UserRole.FINANCIAL],
      },
      {
        title: "Despesas",
        href: PATHS.ADMIN.COMPANY_EXPENSES,
        roles: [UserRole.ADMIN, UserRole.FINANCIAL],
      }
    ]
  },
  {
    title: "Relatórios Financeiros",
    icon: FileText,
    href: PATHS.FINANCIAL.REPORTS,
    roles: [UserRole.FINANCIAL],
  },
];
