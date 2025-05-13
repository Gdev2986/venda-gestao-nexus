
import { BarChart, Users, Store, ShoppingCart, Clock, DollarSign, FileText, Package, MessageSquare, Bell, Settings } from "lucide-react";
import { SidebarItem } from "../types";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";

export const adminItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: PATHS.ADMIN.DASHBOARD,
    icon: BarChart,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Clientes",
    href: PATHS.ADMIN.CLIENTS,
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Parceiros",
    href: PATHS.ADMIN.PARTNERS,
    icon: Store,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Pagamentos",
    href: PATHS.ADMIN.PAYMENTS,
    icon: DollarSign,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Vendas",
    href: PATHS.ADMIN.SALES,
    icon: ShoppingCart,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Logística",
    href: PATHS.ADMIN.LOGISTICS,
    icon: Package,
    roles: [UserRole.ADMIN],
    subItems: [
      {
        title: "Máquinas",
        href: PATHS.ADMIN.MACHINES,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Operações",
        href: PATHS.LOGISTICS.OPERATIONS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Estoque",
        href: PATHS.LOGISTICS.STOCK,
        roles: [UserRole.ADMIN],
      }
    ]
  },
  {
    title: "Relatórios",
    href: PATHS.ADMIN.REPORTS,
    icon: FileText,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Tarifas",
    href: PATHS.ADMIN.FEES,
    icon: Clock,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Suporte",
    href: PATHS.ADMIN.SUPPORT,
    icon: MessageSquare,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Notificações",
    href: PATHS.ADMIN.NOTIFICATIONS,
    icon: Bell,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Configurações",
    href: PATHS.ADMIN.SETTINGS,
    icon: Settings,
    roles: [UserRole.ADMIN],
    subItems: [
      {
        title: "Perfil",
        href: PATHS.ADMIN.SETTINGS,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Usuários",
        href: PATHS.ADMIN.USER_MANAGEMENT,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Segurança",
        href: `${PATHS.ADMIN.SETTINGS}?tab=security`,
        roles: [UserRole.ADMIN],
      },
    ],
  },
];
