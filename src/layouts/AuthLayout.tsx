
import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

const AuthLayout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout;
