import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from 'react-router-dom';

const Register = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        {/* Add registration form here */}
      </div>
    </div>
  );
};

export default Register;
