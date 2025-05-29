
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

const AuthLayout = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className={`min-h-screen flex items-center justify-center bg-background ${
      isMobile ? "p-4" : "p-4"
    }`}>
      <Toaster position="top-right" />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
