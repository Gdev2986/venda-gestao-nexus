
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-muted/20">
      <Toaster />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
