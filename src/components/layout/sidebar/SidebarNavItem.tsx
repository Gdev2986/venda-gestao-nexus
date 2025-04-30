
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarItem, SidebarSubItem } from "./types";
import { UserRole } from "@/types";

interface SidebarNavItemProps {
  item: SidebarItem;
  userRole: UserRole;
}

const SidebarNavItem = ({ item, userRole }: SidebarNavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const isActiveParent = (item: SidebarItem) => {
    if (isActiveRoute(item.href)) return true;
    if (item.subItems?.some(subItem => isActiveRoute(subItem.href))) return true;
    return false;
  };

  // Set expanded state initially and when route changes
  useEffect(() => {
    if (item.subItems && isActiveParent(item)) {
      setExpanded(true);
    }
  }, [item, location.pathname]);

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setExpanded(prev => !prev);
  };

  const handleItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault(); // Prevent default browser navigation
    navigate(href); // Use React Router navigation
  };

  if (item.subItems) {
    return (
      <div className="mb-1">
        <a
          href={item.href}
          onClick={toggleExpanded}
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
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </a>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.subItems.map((subItem) => (
                subItem.roles.includes(userRole) && (
                  <a
                    key={subItem.title}
                    href={subItem.href}
                    onClick={(e) => handleItemClick(e, subItem.href)}
                    className={cn(
                      "flex items-center w-full pl-11 pr-3 py-2 text-sm rounded-md transition-colors mt-1",
                      isActiveRoute(subItem.href)
                        ? "bg-sidebar-accent text-white font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
                    )}
                  >
                    <span>{subItem.title}</span>
                  </a>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <a
      href={item.href}
      onClick={(e) => handleItemClick(e, item.href)}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
        isActiveRoute(item.href)
          ? "bg-sidebar-accent text-white font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
      )}
    >
      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span>{item.title}</span>
    </a>
  );
};

export default SidebarNavItem;
