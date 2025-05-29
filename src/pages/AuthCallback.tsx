
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      const role = user.role || 'CLIENT';
      switch (role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'LOGISTICS':
          navigate('/logistics/dashboard');
          break;
        case 'PARTNER':
          navigate('/partner/dashboard');
          break;
        default:
          navigate('/client/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Processando autenticação...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
