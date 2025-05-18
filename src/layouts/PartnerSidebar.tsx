
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Home,
  CreditCard,
  FileText,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { PATHS } from "@/routes/paths";
import { Button } from "@/components/ui/button";

interface SidebarNavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}

interface PartnerSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

const SidebarNavItem = ({ icon: Icon, label, href, active }: SidebarNavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:bg-accent",
        active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="truncate">{label}</span>
    </Link>
  );
};

const PartnerSidebar = ({ isOpen, onClose, isMobile, userRole }: PartnerSidebarProps) => {
  const location = useLocation();
  
  const checkIsActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "-translate-x-[calc(100%-4px)]",
        )}
      >
        {/* Header */}
        <div className="flex h-14 md:h-16 items-center justify-between px-4 border-b border-border">
          <Link to={PATHS.PARTNER.DASHBOARD} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold">SigmaPay Partners</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col gap-1">
            <SidebarNavItem 
              icon={Home} 
              label="Dashboard" 
              href={PATHS.PARTNER.DASHBOARD}
              active={checkIsActive(PATHS.PARTNER.DASHBOARD)} 
            />
            <SidebarNavItem 
              icon={Users} 
              label="Clientes" 
              href={PATHS.PARTNER.CLIENTS}
              active={checkIsActive(PATHS.PARTNER.CLIENTS)} 
            />
            <SidebarNavItem 
              icon={BarChart3} 
              label="Vendas" 
              href={PATHS.PARTNER.SALES}
              active={checkIsActive(PATHS.PARTNER.SALES)} 
            />
            <SidebarNavItem 
              icon={CreditCard} 
              label="Comissões" 
              href={PATHS.PARTNER.COMMISSIONS}
              active={checkIsActive(PATHS.PARTNER.COMMISSIONS)} 
            />
            <SidebarNavItem 
              icon={FileText} 
              label="Relatórios" 
              href={PATHS.PARTNER.REPORTS}
              active={checkIsActive(PATHS.PARTNER.REPORTS)} 
            />
            <SidebarNavItem 
              icon={MessageSquare} 
              label="Suporte" 
              href={PATHS.PARTNER.SUPPORT}
              active={checkIsActive(PATHS.PARTNER.SUPPORT)} 
            />
            <SidebarNavItem 
              icon={HelpCircle} 
              label="Ajuda" 
              href={PATHS.PARTNER.HELP}
              active={checkIsActive(PATHS.PARTNER.HELP)} 
            />
            <SidebarNavItem 
              icon={Settings} 
              label="Configurações" 
              href={PATHS.PARTNER.SETTINGS}
              active={checkIsActive(PATHS.PARTNER.SETTINGS)} 
            />
          </nav>
        </div>
        
        {/* Desktop toggle button */}
        {!isMobile && (
          <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full border border-border bg-background"
              onClick={onClose}
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isOpen ? "Collapse sidebar" : "Expand sidebar"}
              </span>
            </Button>
          </div>
        )}
        
        {/* Footer with user info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Building2 className="h-4 w-4 text-foreground" />
            </div>
            <div className="ml-3 space-y-0.5">
              <p className="text-sm font-medium">{userRole || "Partner"}</p>
              <p className="text-xs text-muted-foreground">Parceiro</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PartnerSidebar;
