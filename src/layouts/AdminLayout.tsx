
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { SalesProvider } from "@/contexts/SalesContext";

const AdminLayout = () => {
  return (
    <SalesProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </SalesProvider>
  );
};

export default AdminLayout;
