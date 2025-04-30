
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SidebarItem, SidebarSubItem } from "./types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

interface SidebarNavItemProps {
  item: SidebarItem;
  userRole: UserRole;
}

const SidebarNavItem = ({ item, userRole }: SidebarNavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Enhanced path matching
  const isActiveRoute = (href: string) => {
    // Special case for payments
    if (href === PATHS.PAYMENTS) {
      // Check if we're on any payment-related route
      return location.pathname === PATHS.PAYMENTS || 
             location.pathname === PATHS.USER_PAYMENTS ||
             location.pathname === PATHS.CLIENT_PAYMENTS ||
             location.pathname.startsWith(`${PATHS.PAYMENTS}/`);
    }
    
    // Special case for clients
    if (href === PATHS.CLIENTS) {
      return location.pathname === PATHS.CLIENTS ||
             location.pathname.startsWith(PATHS.CLIENT_DETAIL('').replace('/:id', '/')) ||
             location.pathname === PATHS.CLIENT_NEW;
    }
    
    // Special case for partners
    if (href === PATHS.PARTNERS) {
      return location.pathname === PATHS.PARTNERS;
    }
    
    // Normal path matching
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

  // Button animation variants
  const buttonAnimationVariants = {
    initial: { backgroundColor: "transparent" },
    hover: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
    active: { backgroundColor: "rgba(255, 255, 255, 0.2)" }
  };

  // Skip rendering if user doesn't have access to this item
  if (!item.roles.includes(userRole)) {
    return null;
  }

  if (item.subItems) {
    return (
      <div className="mb-1">
        <motion.a
          href={item.href}
          onClick={toggleExpanded}
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
        </motion.a>
        
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: expanded ? "auto" : 0, 
            opacity: expanded ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {item.subItems
            .filter(subItem => subItem.roles.includes(userRole))
            .map((subItem) => (
              <motion.a
                key={subItem.title}
                href={subItem.href}
                onClick={(e) => handleItemClick(e, subItem.href)}
                initial="initial"
                whileHover="hover"
                whileTap="active"
                variants={buttonAnimationVariants}
                className={cn(
                  "flex items-center w-full pl-11 pr-3 py-2 text-sm rounded-md transition-colors mt-1",
                  isActiveRoute(subItem.href)
                    ? "bg-sidebar-accent text-white font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
                )}
              >
                <span>{subItem.title}</span>
              </motion.a>
            ))}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.a
      href={item.href}
      onClick={(e) => handleItemClick(e, item.href)}
      initial="initial"
      whileHover="hover"
      whileTap="active"
      variants={buttonAnimationVariants}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
        isActiveRoute(item.href)
          ? "bg-sidebar-accent text-white font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
      )}
    >
      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span>{item.title}</span>
    </motion.a>
  );
};

export default SidebarNavItem;
