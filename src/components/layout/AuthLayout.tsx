
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
