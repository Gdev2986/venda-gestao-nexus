
import { UserRole } from "@/types";
import SidebarNavItem from "./SidebarNavItem";
import { 
  adminItems, 
  userItems, 
  partnerItems, 
  financialItems, 
  logisticsItems,
  reportItems
} from "./navigation-items";

interface SidebarNavigationProps {
  userRole: UserRole;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
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
        return [...financialItems, ...reportItems.filter(item => item.roles.includes(UserRole.FINANCIAL))];
      case UserRole.LOGISTICS:
        return logisticsItems;
      default:
        return userItems; // Default to user items
    }
  };

  const sidebarItems = getSidebarItems();

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
