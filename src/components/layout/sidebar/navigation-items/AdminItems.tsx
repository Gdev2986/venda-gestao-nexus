
import { Settings, Users, Store, ShoppingCart, BarChart, Clock, DollarSign, FileText, Package, MessageSquare, Bell, Shield } from "lucide-react";
import { SidebarItem } from "../types";
import { PATHS } from "@/routes/paths";

export const adminItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: PATHS.ADMIN.DASHBOARD,
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Clientes",
    href: PATHS.ADMIN.CLIENTS,
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Parceiros",
    href: PATHS.ADMIN.PARTNERS,
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Pagamentos",
    href: PATHS.ADMIN.PAYMENTS,
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Vendas",
    href: PATHS.ADMIN.SALES,
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Logística",
    href: PATHS.ADMIN.LOGISTICS,
    icon: <Package className="h-5 w-5" />,
    submenu: [
      {
        title: "Máquinas",
        href: PATHS.ADMIN.MACHINES
      },
      {
        title: "Operações",
        href: PATHS.LOGISTICS.OPERATIONS
      },
      {
        title: "Estoque",
        href: PATHS.LOGISTICS.STOCK
      }
    ]
  },
  {
    title: "Relatórios",
    href: PATHS.ADMIN.REPORTS,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Tarifas",
    href: PATHS.ADMIN.FEES,
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Suporte",
    href: PATHS.ADMIN.SUPPORT,
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Notificações",
    href: PATHS.ADMIN.NOTIFICATIONS,
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: "Configurações",
    href: PATHS.ADMIN.SETTINGS,
    icon: <Settings className="h-5 w-5" />,
    submenu: [
      {
        title: "Perfil",
        href: PATHS.ADMIN.SETTINGS,
      },
      {
        title: "Usuários",
        href: PATHS.ADMIN.USER_MANAGEMENT,
      },
      {
        title: "Segurança",
        href: `${PATHS.ADMIN.SETTINGS}?tab=security`,
      },
    ],
  },
];
