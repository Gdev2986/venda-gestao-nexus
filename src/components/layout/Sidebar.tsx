
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
  LogOut,
  X,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Percent,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
  subItems?: SidebarSubItem[];
};

type SidebarSubItem = {
  title: string;
  href: string;
  roles: UserRole[];
};

const Sidebar = ({ isOpen, isMobile, onClose, userRole }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

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
      title: "Clientes",
      icon: Users,
      href: "/clients",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
      subItems: [
        {
          title: "Máquinas",
          href: "/machines",
          roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
        }
      ]
    },
    {
      title: "Parceiros",
      icon: Users,
      href: "/partners",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL],
    },
    {
      title: "Pagamentos",
      icon: Wallet,
      href: "/payments",
      roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.FINANCIAL],
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: "/reports",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER],
    },
    {
      title: "Taxas",
      icon: Percent,
      href: "/fees",
      roles: [UserRole.ADMIN, UserRole.FINANCIAL],
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

  const isActiveParent = (item: SidebarItem) => {
    if (isActiveRoute(item.href)) return true;
    if (item.subItems?.some(subItem => isActiveRoute(subItem.href))) return true;
    return false;
  };

  if (!isOpen) {
    return null;
  }

  const filteredItems = sidebarItems.filter((item) => 
    item.roles.includes(userRole)
  );

  const sidebarVariants = {
    hidden: { x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar text-sidebar-foreground",
        isMobile ? "shadow-xl" : "border-r border-sidebar-border"
      )}
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            SP
          </div>
          <span className="text-lg font-semibold">SigmaPay</span>
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
            <div key={item.title}>
              {item.subItems ? (
                <div className="mb-1">
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
                      isActiveParent(item)
                        ? "bg-sidebar-accent text-white font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.includes(item.title) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {item.subItems.map((subItem) => (
                          subItem.roles.includes(userRole) && (
                            <button
                              key={subItem.title}
                              onClick={() => navigate(subItem.href)}
                              className={cn(
                                "flex items-center w-full pl-11 pr-3 py-2 text-sm rounded-md transition-colors mt-1",
                                isActiveRoute(subItem.href)
                                  ? "bg-sidebar-accent text-white font-medium"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
                              )}
                            >
                              <span>{subItem.title}</span>
                            </button>
                          )
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
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
              )}
            </div>
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
    </motion.div>
  );
};

export default Sidebar;
