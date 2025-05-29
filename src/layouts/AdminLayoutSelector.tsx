
import { UserRole } from "@/types";
import LogisticsLayout from "./LogisticsLayout";
import MainLayout from "./MainLayout";
import { useAuth } from "@/hooks/use-auth";

// Custom layout selector based on user role
const AdminLayoutSelector = () => {
  const { userRole } = useAuth();
  
  // Use LogisticsLayout for Logistics users
  if (userRole === UserRole.LOGISTICS) {
    return <LogisticsLayout />;
  }
  
  // Use default MainLayout for other roles
  return <MainLayout />;
};

export default AdminLayoutSelector;
