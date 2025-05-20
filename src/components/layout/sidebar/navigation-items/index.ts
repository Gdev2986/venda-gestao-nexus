// Export all navigation items
export { adminItems } from './AdminItems';
export { userItems } from './UserItems';
export { partnerItems } from './PartnerItems';
export { financialItems } from './FinancialItems';
export { logisticsItems } from './LogisticsItems';

// Add notifications item to all navigation items
import { BellRing } from 'lucide-react';

// Create a shared notifications item to add to all navigation sets
export const notificationsItem = {
  title: "Notificações",
  icon: BellRing,
  href: "/notifications",
  items: []
};
