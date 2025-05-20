
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SidebarItem, SidebarSubItem } from "./types";
import { UserRole } from "@/types";

interface SidebarNavItemProps {
  item: SidebarItem;
  userRole: UserRole;
}

const SidebarNavItem = ({ item, userRole }: SidebarNavItemProps) => {
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

  // Button animation variants
  const buttonAnimationVariants = {
    initial: { backgroundColor: "transparent" },
    hover: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
    active: { backgroundColor: "rgba(255, 255, 255, 0.2)" }
  };

  if (item.subItems) {
    return (
      <div className="mb-1">
        <motion.div
          initial="initial"
          whileHover="hover"
          whileTap="active"
          variants={buttonAnimationVariants}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
            isActiveParent(item)
              ? "bg-sidebar-accent text-white font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
          )}
          onClick={toggleExpanded}
          style={{ cursor: "pointer" }}
        >
          <div className="flex items-center">
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>{item.title}</span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: expanded ? "auto" : 0, 
            opacity: expanded ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {item.subItems.map((subItem) => (
            subItem.roles.includes(userRole) && (
              <Link
                key={subItem.title}
                to={subItem.href}
                className={cn(
                  "flex items-center w-full pl-11 pr-3 py-2 text-sm rounded-md transition-colors mt-1 block",
                  isActiveRoute(subItem.href)
                    ? "bg-sidebar-accent text-white font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
                )}
              >
                <span>{subItem.title}</span>
              </Link>
            )
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors block",
        isActiveRoute(item.href)
          ? "bg-sidebar-accent text-white font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
      )}
    >
      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span>{item.title}</span>
    </Link>
  );
};

export default SidebarNavItem;
