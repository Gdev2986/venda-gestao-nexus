
// Tipos para o novo sistema de autenticação enterprise
export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'partner' | 'client' | 'logistics' | 'financial';
  assigned_at: string;
  assigned_by?: string;
  is_active: boolean;
  expires_at?: string;
}

export interface AuthAuditLog {
  id: string;
  user_id: string;
  event_type: 'login' | 'logout' | 'role_change' | 'password_change' | 'password_reset' | 'session_revoked';
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
  session_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: 'suspicious_login' | 'privilege_escalation' | 'data_access' | 'multiple_failed_logins' | 'unusual_location';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source_ip?: string;
  metadata: Record<string, any>;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
}

export interface EnhancedUserSession {
  id: string;
  user_id: string;
  device_id: string;
  browser_info?: string;
  os_info?: string;
  is_mobile: boolean;
  location_country?: string;
  last_active: string;
  metadata: Record<string, any>;
  is_revoked: boolean;
  revoked_at?: string;
  created_at: string;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  isMobile: boolean;
  userAgent: string;
  fingerprint: string;
}
