
import { Route } from "react-router-dom";
import { UserRole } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { adminRoutes } from "./admin/adminRoutes";

export const AdminRoutes = (
  <Route 
    path="admin/*" 
    element={
      <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.LOGISTICS, UserRole.FINANCIAL]}>
        <div>Loading admin...</div>
      </AuthGuard>
    }
  >
    {adminRoutes}
  </Route>
);
