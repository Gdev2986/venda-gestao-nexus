
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

const AuthLayout = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isMobile 
        ? "bg-background p-4" 
        : "bg-gradient-to-b from-background/50 to-background p-4 dark:from-background dark:to-background/80"
    }`}>
      <Toaster position="top-right" />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
