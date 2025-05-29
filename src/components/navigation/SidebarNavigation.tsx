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
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarNav } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarNavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = user ? getSidebarItems(user.role) : [];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="font-bold text-xl">SigmaPay</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav>
          {sidebarItems.map((item) => (
            <SidebarItem 
              key={item.path} 
              title={item.label} 
              icon={item.icon}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </SidebarNav>
      </SidebarContent>
      <SidebarFooter>
        {/* You can add a footer here, like a logout button or additional information */}
      </SidebarFooter>
    </Sidebar>
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
        { path: '/client/sales', label: 'Vendas', icon: BarChart },
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
        { path: '/admin/users', label: 'Usuários', icon: User },
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
        { path: '/logistics/installations', label: 'Instalações', icon: Package },
        { path: '/logistics/support', label: 'Suporte', icon: HelpCircle },
        { path: '/logistics/reports', label: 'Relatórios', icon: FileText },
        ...commonItems
      ];

    default:
      return commonItems;
  }
};

export default SidebarNavigation;
