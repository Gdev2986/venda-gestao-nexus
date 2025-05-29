
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Server, 
  BarChart, 
  CreditCard, 
  HelpCircle, 
  BookOpen, 
  Settings, 
  User,
  Users,
  DollarSign,
  UserPlus,
  FileText,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarNavItemProps {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  isActive: boolean;
  onClick: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  path, 
  label, 
  icon: Icon, 
  isActive, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive && "bg-gray-100 dark:bg-gray-800 text-primary"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
};

const SidebarNavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = user ? getSidebarItems(user.role) : [];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="p-4">
        <div className="font-bold text-xl mb-6">SigmaPay</div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isActive={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

const getSidebarItems = (userRole: string) => {
  const commonItems = [
    { path: '/profile', label: 'Perfil', icon: User }
  ];

  switch (userRole) {
    case 'CLIENT':
      return [
        { path: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/client/machines', label: 'Máquinas', icon: Server },
        { path: '/client/payments', label: 'Pagamentos', icon: CreditCard },
        { path: '/client/support', label: 'Suporte', icon: HelpCircle },
        { path: '/client/help', label: 'Ajuda', icon: BookOpen },
        { path: '/client/settings', label: 'Configurações', icon: Settings },
        ...commonItems
      ];

    case 'USER':
      return [
        { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/user/machines', label: 'Máquinas', icon: Server },
        { path: '/user/payments', label: 'Pagamentos', icon: CreditCard },
        { path: '/user/support', label: 'Suporte', icon: HelpCircle },
        { path: '/user/help', label: 'Ajuda', icon: BookOpen },
        { path: '/user/settings', label: 'Configurações', icon: Settings },
        ...commonItems
      ];

    case 'PARTNER':
      return [
        { path: '/partner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/partner/clients', label: 'Clientes', icon: Users },
        { path: '/partner/commissions', label: 'Comissões', icon: DollarSign },
        ...commonItems
      ];

    case 'ADMIN':
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/clients', label: 'Clientes', icon: Users },
        { path: '/admin/machines', label: 'Máquinas', icon: Server },
        { path: '/admin/partners', label: 'Parceiros', icon: UserPlus },
        { path: '/admin/sales', label: 'Vendas', icon: BarChart },
        { path: '/admin/payments', label: 'Pagamentos', icon: CreditCard },
        { path: '/admin/support', label: 'Suporte', icon: HelpCircle },
        { path: '/admin/reports', label: 'Relatórios', icon: FileText },
        { path: '/admin/settings', label: 'Configurações', icon: Settings }
      ];

    case 'LOGISTICS':
      return [
        { path: '/logistics/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/logistics/machines', label: 'Máquinas', icon: Server },
        { path: '/logistics/support', label: 'Suporte', icon: HelpCircle },
        { path: '/logistics/reports', label: 'Relatórios', icon: FileText },
        ...commonItems
      ];

    default:
      return commonItems;
  }
};

export default SidebarNavigation;
