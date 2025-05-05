import { Home, Users, UserPlus, ShoppingCart, CreditCard, BarChart, Settings, Truck, Package, Wallet, Bell, HelpCircle, LogOut, User, Building, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: NavItem[];
}

export default function SidebarNavigation({ userRole }: { userRole: UserRole }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Admin navigation items
  const adminItems: NavItem[] = [
    { title: "Dashboard", href: PATHS.ADMIN.DASHBOARD, icon: Home },
    { title: "Clientes", href: PATHS.ADMIN.CLIENTS, icon: Users },
    { title: "Parceiros", href: PATHS.ADMIN.PARTNERS, icon: UserPlus },
    { title: "Vendas", href: PATHS.ADMIN.SALES, icon: ShoppingCart },
    { title: "Pagamentos", href: PATHS.ADMIN.PAYMENTS, icon: CreditCard },
    { title: "Logística", href: PATHS.ADMIN.LOGISTICS, icon: Truck },
    { title: "Relatórios", href: PATHS.ADMIN.REPORTS, icon: BarChart },
    { title: "Configurações", href: PATHS.ADMIN.FEES, icon: Settings },
  ];

  // Client navigation items
  const clientItems: NavItem[] = [
    { title: "Dashboard", href: PATHS.CLIENT.DASHBOARD, icon: Home },
    { title: "Vendas", href: PATHS.CLIENT.SALES, icon: ShoppingCart },
    { title: "Máquinas", href: PATHS.CLIENT.MACHINES, icon: Package },
    { title: "Pagamentos", href: PATHS.CLIENT.PAYMENTS, icon: Wallet },
    { title: "Suporte", href: PATHS.CLIENT.SUPPORT, icon: HelpCircle },
  ];

  // Partner navigation items
  const partnerItems: NavItem[] = [
    { title: "Dashboard", href: PATHS.PARTNER.DASHBOARD, icon: Home },
    { title: "Clientes", href: PATHS.PARTNER.CLIENTS, icon: Users },
    { title: "Vendas", href: PATHS.PARTNER.SALES, icon: ShoppingCart },
    { title: "Comissões", href: PATHS.PARTNER.COMMISSIONS, icon: Wallet },
    { title: "Suporte", href: PATHS.PARTNER.SUPPORT, icon: HelpCircle },
  ];

  // Financial navigation items
  const financialItems: NavItem[] = [
    { title: "Dashboard", href: PATHS.FINANCIAL.DASHBOARD, icon: Home },
    { title: "Pagamentos", href: PATHS.FINANCIAL.PAYMENTS, icon: CreditCard },
    { title: "Comissões", href: PATHS.FINANCIAL.COMMISSIONS, icon: Wallet },
    { title: "Relatórios", href: PATHS.FINANCIAL.REPORTS, icon: BarChart },
    { title: "Clientes", href: PATHS.FINANCIAL.CLIENTS, icon: Users },
  ];

  // Logistics navigation items
  const logisticsItems: NavItem[] = [
    { title: "Dashboard", href: PATHS.LOGISTICS.DASHBOARD, icon: LayoutDashboard },
    { title: "Máquinas", href: PATHS.LOGISTICS.MACHINES, icon: Package },
    { title: "Operações", href: PATHS.LOGISTICS.LOGISTICS_MODULE, icon: Truck },
    { title: "Suporte", href: PATHS.LOGISTICS.SUPPORT, icon: Bell },
    { title: "Clientes", href: PATHS.LOGISTICS.CLIENTS, icon: Building },
  ];

  // Determine which navigation items to show based on user role
  const navItems = (() => {
    switch (userRole) {
      case UserRole.ADMIN:
        return adminItems;
      case UserRole.CLIENT:
        return clientItems;
      case UserRole.PARTNER:
        return partnerItems;
      case UserRole.FINANCIAL:
        return financialItems;
      case UserRole.LOGISTICS:
        return logisticsItems;
      default:
        return [];
    }
  })();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = currentPath === item.href || 
          (item.href !== '/' && currentPath.startsWith(item.href));
        
        if (item.submenu) {
          return (
            <Accordion key={item.title} type="single" collapsible className="border-none">
              <AccordionItem value={item.title} className="border-none">
                <AccordionTrigger className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-white no-underline",
                  isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                )}>
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = currentPath === subItem.href;
                      return (
                        <Link
                          key={subItem.title}
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            "hover:bg-sidebar-accent hover:text-white",
                            isSubActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }
        
        return (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-sidebar-accent hover:text-white",
              isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
