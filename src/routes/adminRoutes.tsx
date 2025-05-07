
import { Route, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/MainLayout";
import LogisticsLayout from "../layouts/LogisticsLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminClients from "../pages/admin/Clients";
import AdminSales from "../pages/admin/Sales";
import AdminPartners from "../pages/admin/Partners";
import AdminPayments from "../pages/admin/Payments";
import AdminSupport from "../pages/admin/Support";
import AdminSettings from "../pages/admin/Settings";

// Clients
import ClientDetails from "../pages/clients/ClientDetails";
import NewClient from "../pages/clients/NewClient";

// Machines
import Machines from "../pages/machines/Machines";
import NewMachine from "../pages/machines/NewMachine";
import MachineDetails from "../pages/machines/MachineDetails";

// Sales
import SaleDetails from "../pages/sales/SaleDetails";
import NewSale from "../pages/sales/NewSale";

// Partners
import PartnerDetails from "../pages/partners/PartnerDetails";
import NewPartner from "../pages/partners/NewPartner";

// Settings
import UserManagement from "../pages/settings/UserManagement";

// Logistics pages
import LogisticsDashboard from "../pages/logistics/Dashboard";
import Operations from "../pages/logistics/Operations";
import LogisticsRequests from "../pages/logistics/Requests";
import LogisticsCalendar from "../pages/logistics/Calendar";
import LogisticsInventory from "../pages/logistics/Inventory";

// Other
import Fees from "../pages/Fees";
import AdminReports from "../pages/admin/Reports";
import Help from "../pages/Help";

// Import Clients from clients folder instead of directly
import Clients from "../pages/clients/Clients";
import { useUserRole } from "@/hooks/use-user-role";

// Custom layout selector based on user role - fixed to use correct props pattern
const AdminLayoutSelector = () => {
  const { userRole } = useUserRole();
  
  // Use LogisticsLayout for Logistics users
  if (userRole === UserRole.LOGISTICS) {
    return <LogisticsLayout />;
  }
  
  // Use default MainLayout for other roles
  return <MainLayout />;
};

export const AdminRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.LOGISTICS]} />}>
    <Route element={<AdminLayoutSelector />}>
      <Route
        path={PATHS.ADMIN.DASHBOARD}
        element={<AdminDashboard />}
      />
      
      <Route 
        path={PATHS.ADMIN.CLIENTS} 
        element={<AdminClients />} 
      />
      
      <Route 
        path={PATHS.ADMIN.CLIENT_DETAILS()} 
        element={<ClientDetails />} 
      />
      
      <Route 
        path={PATHS.ADMIN.CLIENT_NEW} 
        element={<NewClient />} 
      />
      
      {/* Logistics routes accessible to admin */}
      <Route 
        path={PATHS.LOGISTICS.DASHBOARD} 
        element={<LogisticsDashboard />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.MACHINES} 
        element={<Machines />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.MACHINE_NEW} 
        element={<NewMachine />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.MACHINE_DETAILS()} 
        element={<MachineDetails />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.OPERATIONS} 
        element={<Operations />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.REQUESTS} 
        element={<LogisticsRequests />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.CALENDAR} 
        element={<LogisticsCalendar />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.INVENTORY} 
        element={<LogisticsInventory />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.CLIENTS} 
        element={<Clients />} 
      />
      
      {/* Original admin routes */}
      <Route 
        path={PATHS.ADMIN.SALES} 
        element={<AdminSales />} 
      />
      
      <Route 
        path={PATHS.ADMIN.SALES_DETAILS()} 
        element={<SaleDetails />} 
      />
      
      <Route 
        path={PATHS.ADMIN.SALES_NEW} 
        element={<NewSale />} 
      />
      
      <Route 
        path={PATHS.ADMIN.PAYMENTS} 
        element={<AdminPayments />} 
      />
      
      <Route 
        path={PATHS.ADMIN.PAYMENT_DETAILS()} 
        element={<AdminPayments />} 
      />
      
      <Route path={PATHS.ADMIN.PAYMENT_NEW} element={<AdminPayments />} />
      
      <Route 
        path={PATHS.ADMIN.PARTNERS} 
        element={<AdminPartners />} 
      />
      
      <Route 
        path={PATHS.ADMIN.PARTNER_DETAILS()} 
        element={<PartnerDetails />} 
      />
      
      <Route 
        path={PATHS.ADMIN.PARTNER_NEW} 
        element={<NewPartner />} 
      />
      
      <Route 
        path={PATHS.ADMIN.LOGISTICS} 
        element={
          <Navigate to={PATHS.LOGISTICS.DASHBOARD} replace />
        } 
      />
      
      <Route path={PATHS.ADMIN.SETTINGS} element={<AdminSettings />} />
      
      <Route 
        path={PATHS.ADMIN.USER_MANAGEMENT} 
        element={<UserManagement />} 
      />
      
      <Route path={PATHS.ADMIN.FEES} element={<Fees />} />
      
      <Route path={PATHS.ADMIN.REPORTS} element={<AdminReports />} />
      
      <Route path={PATHS.ADMIN.SUPPORT} element={<AdminSupport />} />
    </Route>
  </Route>
);
