
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import SidebarNavItem from "./SidebarNavItem";
import { 
  Home, 
  Users, 
  Settings, 
  Wallet, 
  BarChart3, 
  Package, 
  HelpCircle, 
  Bell,
  LayoutGrid,
  UserPlus,
  Truck,
  ArrowRightLeft,
  CreditCard,
  User
} from "lucide-react";
import { PATHS } from "@/routes/paths";
import { useState } from "react";
import { UserRole } from "@/types";

interface SidebarNavigationProps {
  userRole: UserRole;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
  const location = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  
  const handleToggle = (key: string) => {
    setOpen(prev => prev === key ? null : key);
  };

  // Determine which navigation to show based on user role
  const renderNavigation = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return (
          <>
            <SidebarNavItem icon={Home} href={PATHS.ADMIN.DASHBOARD} active={location.pathname === PATHS.ADMIN.DASHBOARD}>
              Dashboard
            </SidebarNavItem>
            
            <SidebarNavItem icon={Users} href={PATHS.ADMIN.CLIENTS} active={location.pathname.startsWith('/admin/clients')}>
              Clientes
            </SidebarNavItem>
            
            <SidebarNavItem icon={UserPlus} href={PATHS.ADMIN.PARTNERS} active={location.pathname.startsWith('/admin/partners')}>
              Parceiros
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={CreditCard} 
              href={PATHS.ADMIN.PAYMENTS} 
              active={location.pathname === PATHS.ADMIN.PAYMENTS}
            >
              Pagamentos
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={BarChart3} 
              href={PATHS.ADMIN.SALES} 
              active={location.pathname === PATHS.ADMIN.SALES}
            >
              Vendas
            </SidebarNavItem>
            
            <SidebarNavItem
              icon={Package}
              href={PATHS.ADMIN.FEES}
              active={location.pathname === PATHS.ADMIN.FEES}
            >
              Taxas
            </SidebarNavItem>
            
            <SidebarNavItem icon={Bell} href={PATHS.ADMIN.NOTIFICATIONS} active={location.pathname === PATHS.ADMIN.NOTIFICATIONS}>
              Notificações
            </SidebarNavItem>

            <SidebarNavItem
              icon={Truck}
              href={PATHS.LOGISTICS.OPERATIONS}
              active={location.pathname === PATHS.LOGISTICS.OPERATIONS}
            >
              Logística
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={BarChart3} 
              href={PATHS.ADMIN.REPORTS} 
              active={location.pathname === PATHS.ADMIN.REPORTS}
            >
              Relatórios
            </SidebarNavItem>
            
            <SidebarNavItem icon={Settings} href={PATHS.ADMIN.SETTINGS} active={location.pathname === PATHS.ADMIN.SETTINGS}>
              Configurações
            </SidebarNavItem>
          </>
        );

      case UserRole.CLIENT:
        return (
          <>
            <SidebarNavItem icon={Home} href={PATHS.USER.DASHBOARD} active={location.pathname === PATHS.USER.DASHBOARD}>
              Dashboard
            </SidebarNavItem>
            
            <SidebarNavItem icon={Package} href={PATHS.USER.MACHINES} active={location.pathname === PATHS.USER.MACHINES}>
              Máquinas
            </SidebarNavItem>
            
            <SidebarNavItem icon={Wallet} href={PATHS.USER.PAYMENTS} active={location.pathname === PATHS.USER.PAYMENTS}>
              Pagamentos
            </SidebarNavItem>
            
            <SidebarNavItem icon={HelpCircle} href={PATHS.USER.SUPPORT} active={location.pathname === PATHS.USER.SUPPORT}>
              Suporte
            </SidebarNavItem>
          </>
        );
        
      case UserRole.PARTNER:
        return (
          <>
            <SidebarNavItem icon={Home} href={PATHS.PARTNER.DASHBOARD} active={location.pathname === PATHS.PARTNER.DASHBOARD}>
              Dashboard
            </SidebarNavItem>
            
            <SidebarNavItem icon={Users} href={PATHS.PARTNER.CLIENTS} active={location.pathname === PATHS.PARTNER.CLIENTS}>
              Clientes
            </SidebarNavItem>
            
            <SidebarNavItem icon={Wallet} href={PATHS.PARTNER.COMMISSIONS} active={location.pathname === PATHS.PARTNER.COMMISSIONS}>
              Comissões
            </SidebarNavItem>
            
            <SidebarNavItem icon={Settings} href={PATHS.PARTNER.SETTINGS} active={location.pathname === PATHS.PARTNER.SETTINGS}>
              Configurações
            </SidebarNavItem>
          </>
        );

      case UserRole.FINANCIAL:
        return (
          <>
            <SidebarNavItem icon={Home} href={PATHS.FINANCIAL.DASHBOARD} active={location.pathname === PATHS.FINANCIAL.DASHBOARD}>
              Dashboard
            </SidebarNavItem>
            
            <SidebarNavItem icon={ArrowRightLeft} href={PATHS.FINANCIAL.REQUESTS} active={location.pathname === PATHS.FINANCIAL.REQUESTS}>
              Solicitações
            </SidebarNavItem>
            
            <SidebarNavItem icon={BarChart3} href={PATHS.FINANCIAL.REPORTS} active={location.pathname === PATHS.FINANCIAL.REPORTS}>
              Relatórios
            </SidebarNavItem>
          </>
        );

      case UserRole.LOGISTICS:
        return (
          <>
            <SidebarNavItem icon={Home} href={PATHS.LOGISTICS.DASHBOARD} active={location.pathname === PATHS.LOGISTICS.DASHBOARD}>
              Dashboard
            </SidebarNavItem>
            
            <SidebarNavItem icon={Package} href={PATHS.LOGISTICS.MACHINES} active={location.pathname === PATHS.LOGISTICS.MACHINES}>
              Máquinas
            </SidebarNavItem>
            
            <SidebarNavItem icon={Truck} href={PATHS.LOGISTICS.OPERATIONS} active={location.pathname === PATHS.LOGISTICS.OPERATIONS}>
              Operações
            </SidebarNavItem>
            
            <SidebarNavItem icon={HelpCircle} href={PATHS.LOGISTICS.SUPPORT} active={location.pathname === PATHS.LOGISTICS.SUPPORT}>
              Suporte
            </SidebarNavItem>
          </>
        );
      
      default:
        return (
          <SidebarNavItem icon={Settings} href="/settings" active={location.pathname === '/settings'}>
            Configurações
          </SidebarNavItem>
        );
    }
  };

  return (
    <div className="space-y-1 py-2">
      {renderNavigation()}
    </div>
  );
};

export default SidebarNavigation;
