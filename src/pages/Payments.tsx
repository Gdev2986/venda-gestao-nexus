
import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { UserRole } from "@/types";
import { useUserRole } from "@/hooks/use-user-role";
import UserPayments from './UserPayments';
import ClientPayments from './ClientPayments';

const Payments = () => {
  const location = useLocation();
  const { userRole } = useUserRole();
  const [redirected, setRedirected] = useState(false);

  // Use effect to prevent infinite redirects
  useEffect(() => {
    setRedirected(true);
  }, []);

  // Show appropriate payment page based on user role
  if (redirected) {
    if (userRole === UserRole.CLIENT) {
      return <ClientPayments />;
    } else {
      return <UserPayments />;
    }
  }

  // Show loading state initially
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default Payments;
