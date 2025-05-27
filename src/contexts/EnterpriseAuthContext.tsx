
import React, { createContext, useContext } from 'react';
import { useEnterpriseAuth } from '@/hooks/auth/useEnterpriseAuth';
import { User, Session } from '@supabase/supabase-js';
import { DeviceInfo } from '@/types/auth.types';

interface EnterpriseAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: string | null;
  isAuthenticated: boolean;
  logAuditEvent: (eventType: string, metadata?: Record<string, any>) => Promise<void>;
  logSecurityEvent: (
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  getDeviceInfo: () => DeviceInfo;
}

const EnterpriseAuthContext = createContext<EnterpriseAuthContextType | undefined>(undefined);

export const EnterpriseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useEnterpriseAuth();

  return (
    <EnterpriseAuthContext.Provider value={auth}>
      {children}
    </EnterpriseAuthContext.Provider>
  );
};

export const useEnterpriseAuthContext = () => {
  const context = useContext(EnterpriseAuthContext);
  if (context === undefined) {
    throw new Error('useEnterpriseAuthContext deve ser usado dentro de EnterpriseAuthProvider');
  }
  return context;
};
