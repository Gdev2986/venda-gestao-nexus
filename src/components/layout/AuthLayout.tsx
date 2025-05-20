
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" closeButton />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
