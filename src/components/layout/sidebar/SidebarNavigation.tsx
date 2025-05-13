
import { UserRole } from "@/types";
import SidebarNavItem from "./SidebarNavItem";
import { 
  adminItems, 
  userItems, 
  partnerItems, 
  financialItems, 
  logisticsItems
} from "./navigation-items";

interface SidebarNavigationProps {
  userRole: UserRole;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
  console.log("SidebarNavigation: Current user role:", userRole);
  
  // Get items based on user role
  const getSidebarItems = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return adminItems;
      case UserRole.CLIENT:
        return userItems;
      case UserRole.PARTNER:
        return partnerItems;
      case UserRole.FINANCIAL:
        return financialItems;
      case UserRole.LOGISTICS:
        return logisticsItems;
      default:
        console.log("SidebarNavigation: Unknown user role, defaulting to user items");
        return userItems; // Default to user items
    }
  };

  const sidebarItems = getSidebarItems();
  console.log("SidebarNavigation: Loaded items for role:", userRole, "Count:", sidebarItems.length);

  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => (
        <div key={item.title}>
          <SidebarNavItem item={item} userRole={userRole} />
        </div>
      ))}
    </nav>
  );
};

export default SidebarNavigation;
