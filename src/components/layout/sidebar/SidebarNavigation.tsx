import { Home, Users, Building, ShoppingCart, Box, File, Settings, Wallet } from "lucide-react";
import { useLocation, matchPath } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/ui/nav-link";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function SidebarNavigation({ userRole }: { userRole: UserRole }) {
  const location = useLocation();

  const isActive = (path: string) => {
    return !!matchPath({ path, end: false }, location.pathname);
  };
  
  const adminItems = [
    {
      name: "Dashboard",
      href: PATHS.ADMIN.DASHBOARD,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      href: PATHS.ADMIN.CLIENTS,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Parceiros",
      href: PATHS.ADMIN.PARTNERS,
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: "Vendas",
      href: PATHS.ADMIN.SALES,
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Máquinas",
      href: PATHS.ADMIN.MACHINES,
      icon: <Box className="h-5 w-5" />,
    },
    {
      name: "Pagamentos",
      href: PATHS.ADMIN.PAYMENTS,
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Taxas",
      href: PATHS.ADMIN.FEES,
      icon: <File className="h-5 w-5" />,
    },
    {
      name: "Relatórios",
      href: PATHS.ADMIN.REPORTS,
      icon: <File className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      href: PATHS.ADMIN.SETTINGS,
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const financialItems = [
    {
      name: "Dashboard",
      href: PATHS.FINANCIAL.DASHBOARD,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Solicitações",
      href: PATHS.FINANCIAL.REQUESTS,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Pagamentos",
      href: PATHS.ADMIN.PAYMENTS,
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Relatórios",
      href: PATHS.FINANCIAL.REPORTS,
      icon: <File className="h-5 w-5" />,
    },
  ];

  const partnerItems: NavItem[] = [
    {
      name: "Dashboard",
      href: PATHS.PARTNER.DASHBOARD,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      href: PATHS.PARTNER.CLIENTS,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Comissões",
      href: PATHS.PARTNER.COMMISSIONS,
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      href: PATHS.PARTNER.SETTINGS,
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const clientItems: NavItem[] = [
    {
      name: "Dashboard",
      href: PATHS.CLIENT.DASHBOARD,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Máquinas",
      href: PATHS.CLIENT.MACHINES,
      icon: <Box className="h-5 w-5" />,
    },
    {
      name: "Pagamentos",
      href: PATHS.CLIENT.PAYMENTS,
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Suporte",
      href: PATHS.CLIENT.SUPPORT,
      icon: <Box className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      href: PATHS.CLIENT.SETTINGS,
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const logisticsItems: NavItem[] = [
    {
      name: "Dashboard",
      href: PATHS.LOGISTICS.DASHBOARD,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Máquinas",
      href: PATHS.LOGISTICS.MACHINES,
      icon: <Box className="h-5 w-5" />,
    },
    {
      name: "Operações",
      href: PATHS.LOGISTICS.OPERATIONS,
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Suporte",
      href: PATHS.LOGISTICS.SUPPORT,
      icon: <Box className="h-5 w-5" />,
    },
  ];

  let navItems: NavItem[] = [];

  switch (userRole) {
    case UserRole.ADMIN:
      navItems = adminItems;
      break;
    case UserRole.FINANCIAL:
      navItems = financialItems;
      break;
    case UserRole.PARTNER:
      navItems = partnerItems;
      break;
    case UserRole.CLIENT:
      navItems = clientItems;
      break;
    case UserRole.LOGISTICS:
      navItems = logisticsItems;
      break;
    default:
      navItems = [];
      break;
  }

  return (
    <div className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-white",
            isActive(item.href)
              ? "bg-sidebar-accent text-white"
              : "text-sidebar-foreground"
          )}
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}
