
import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationDropdown from "./NotificationDropdown";
import { AnimatePresence, motion } from "framer-motion";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Default to ADMIN role for now, should be determined from auth
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        isMobile={isMobile} 
        onClose={() => setSidebarOpen(false)} 
        userRole={userRole}
      />
      
      {/* Main content - adjust the left margin based on sidebar state */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${
          sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background z-10">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">SigmaPay</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
          </div>
        </header>
        
        {/* Scrollable content with animation */}
        <AnimatePresence mode="wait">
          <motion.main 
            key={window.location.pathname}
            className="flex-1 overflow-auto p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      
      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
