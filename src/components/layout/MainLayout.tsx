
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { TopNav } from "@/components/ui/top-nav";
import { RealtimeToastNotifications } from "@/components/notifications/RealtimeToastNotifications";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { UserRole } from "@/types";

const MainLayout = () => {
  return (
    <AuthGuard requireAuth={true} allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.PARTNER, UserRole.FINANCIAL, UserRole.LOGISTICS]}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopNav />
            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
              <RealtimeToastNotifications />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default MainLayout;
