
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { SalesProvider } from "@/contexts/SalesContext";
import { UserRole } from "@/types/enums";
import { useMediaQuery } from "@/hooks/use-media-query";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SalesProvider>
      <div className="flex h-screen bg-background">
        <Sidebar 
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onClose={handleSidebarClose}
          userRole={UserRole.ADMIN}
        />
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
