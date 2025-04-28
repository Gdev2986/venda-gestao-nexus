
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListOrdered,
  Wallet,
  Settings,
  Users,
  BarChart3,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  userRole: UserRole;
}

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
};

const Sidebar = ({ isOpen, isMobile, onClose, userRole }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Vendas",
      icon: ListOrdered,
      href: "/sales",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Pagamentos",
      icon: Wallet,
      href: "/payments",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL],
    },
    {
      title: "Clientes",
      icon: Users,
      href: "/clients",
      roles: [UserRole.ADMIN, UserRole.PARTNER],
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: "/reports",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Suporte",
      icon: MessageSquare,
      href: "/support",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/settings",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL, UserRole.PARTNER],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/");
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  if (!isOpen) {
    return null;
  }

  const filteredItems = sidebarItems.filter((item) => 
    item.roles.includes(userRole)
  );

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            GV
          </div>
          <span className="text-lg font-semibold">Nexus</span>
        </div>

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.href)}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                isActiveRoute(item.href)
                  ? "bg-sidebar-accent text-white font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <Separator className="my-4 bg-sidebar-border" />

        <div className="space-y-1">
          <button
            onClick={() => {
              toast({
                title: "Ajuda",
                description: "Função ainda não implementada.",
              });
            }}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white transition-colors"
          >
            <HelpCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Ajuda</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-white">
            {userRole.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium truncate">Conta {userRole}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {userRole === UserRole.ADMIN && "Administrador"}
              {userRole === UserRole.CLIENT && "Cliente"}
              {userRole === UserRole.FINANCIAL && "Financeiro"}
              {userRole === UserRole.PARTNER && "Parceiro"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
