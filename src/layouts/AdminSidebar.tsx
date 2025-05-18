
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShoppingBag,
  Building,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Truck
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

interface AdminSidebarProps {
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

const AdminSidebar = ({ isOpen, onClose, isMobile, userRole }: AdminSidebarProps) => {
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
          <Link to={PATHS.ADMIN.DASHBOARD} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold">SigmaPay Admin</span>
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
              icon={LayoutDashboard} 
              label="Dashboard" 
              href={PATHS.ADMIN.DASHBOARD}
              active={checkIsActive(PATHS.ADMIN.DASHBOARD)} 
            />
            <SidebarNavItem 
              icon={Users} 
              label="Clientes" 
              href={PATHS.ADMIN.CLIENTS}
              active={checkIsActive(PATHS.ADMIN.CLIENTS)} 
            />
            <SidebarNavItem 
              icon={ShoppingBag} 
              label="Vendas" 
              href={PATHS.ADMIN.SALES}
              active={checkIsActive(PATHS.ADMIN.SALES)} 
            />
            <SidebarNavItem 
              icon={CreditCard} 
              label="Pagamentos" 
              href={PATHS.ADMIN.PAYMENTS}
              active={checkIsActive(PATHS.ADMIN.PAYMENTS)} 
            />
            <SidebarNavItem 
              icon={Building} 
              label="Parceiros" 
              href={PATHS.ADMIN.PARTNERS}
              active={checkIsActive(PATHS.ADMIN.PARTNERS)} 
            />
            <SidebarNavItem 
              icon={Truck} 
              label="Logística" 
              href={PATHS.ADMIN.LOGISTICS}
              active={checkIsActive(PATHS.ADMIN.LOGISTICS)} 
            />
            <SidebarNavItem 
              icon={Settings} 
              label="Configurações" 
              href={PATHS.ADMIN.SETTINGS}
              active={checkIsActive(PATHS.ADMIN.SETTINGS)} 
            />
            <SidebarNavItem 
              icon={HelpCircle} 
              label="Suporte" 
              href={PATHS.ADMIN.SUPPORT}
              active={checkIsActive(PATHS.ADMIN.SUPPORT)} 
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
              <Users className="h-4 w-4 text-foreground" />
            </div>
            <div className="ml-3 space-y-0.5">
              <p className="text-sm font-medium">{userRole || "Administrator"}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
