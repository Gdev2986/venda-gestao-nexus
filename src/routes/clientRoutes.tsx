
import { Route } from "react-router-dom";
import { UserRole } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";
import UserLayout from "../layouts/UserLayout";

// Import pages
import UserDashboard from "../pages/user/Dashboard";
import UserPayments from "../pages/user/Payments";
import UserMachines from "../pages/user/Machines";
import UserSettings from "../pages/user/Settings";
import UserSupport from "../pages/user/Support";

export const ClientRoutes = (
  <Route 
    path="/user/*" 
    element={
      <AuthGuard allowedRoles={[UserRole.CLIENT]}>
        <UserLayout />
      </AuthGuard>
    }
  >
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="payments" element={<UserPayments />} />
    <Route path="machines" element={<UserMachines />} />
    <Route path="settings" element={<UserSettings />} />
    <Route path="support" element={<UserSupport />} />
  </Route>
);
