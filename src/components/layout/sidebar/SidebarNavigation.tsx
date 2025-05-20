
import { UserRole } from "@/types";
import SidebarNavItem from "./SidebarNavItem";
import { 
  adminItems, 
  userItems, 
  partnerItems, 
  financialItems, 
  logisticsItems,
  notificationsItem 
} from "./navigation-items";

interface SidebarNavigationProps {
  userRole: UserRole | null;
}

const SidebarNavigation = ({ userRole }: SidebarNavigationProps) => {
  // Get items based on user role
  const getSidebarItems = () => {
    let items;
    
    switch (userRole) {
      case UserRole.ADMIN:
        items = [...adminItems];
        break;
      case UserRole.CLIENT:
        items = [...userItems];
        break;
      case UserRole.PARTNER:
        items = [...partnerItems];
        break;
      case UserRole.FINANCIAL:
        items = [...financialItems];
        break;
      case UserRole.LOGISTICS:
        items = [...logisticsItems];
        break;
      default:
        items = [...userItems]; // Default to user items when userRole is null or unrecognized
    }
    
    // Add notifications item to all navigation sets if it's not already included
    if (!items.some(item => item.href === notificationsItem.href)) {
      items.push(notificationsItem);
    }
    
    return items;
  };

  const sidebarItems = getSidebarItems();

  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => (
        <div key={item.title}>
          <SidebarNavItem item={item} userRole={userRole || UserRole.CLIENT} />
        </div>
      ))}
    </nav>
  );
};

export default SidebarNavigation;
