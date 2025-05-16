
export const PATHS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  
  // Home
  HOME: "/",
  
  // Main
  DASHBOARD: "/dashboard",
  CLIENTS: "/clients",
  CLIENT_REGISTRATION: "/client-registration",
  
  // Admin
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    SETTINGS: "/admin/settings",
    SALES: "/admin/sales",
    PAYMENTS: "/admin/payments",
    PARTNERS: "/admin/partners",
    REPORTS: "/admin/reports",
    FEES: "/admin/fees",
    SUPPORT: "/admin/support"
  },
  
  // Partner
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    SALES: "/partner/sales",
    COMMISSIONS: "/partner/commissions",
    REPORTS: "/partner/reports",
    SUPPORT: "/partner/support",
    HELP: "/partner/help",
    SETTINGS: "/partner/settings"
  },
  
  // Client
  CLIENT_DASHBOARD: "/client/dashboard",
  CLIENT_PAYMENTS: "/client/payments",
  
  // User (Client)
  USER: {
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    SUPPORT: "/client/support",
    HELP: "/client/help",
    SETTINGS: "/client/settings"
  },
  
  // Financial
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    REPORTS: "/financial/reports",
    SETTINGS: "/financial/settings"
  },
  
  // Logistics
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    OPERATIONS: "/logistics/operations",
    REQUESTS: "/logistics/requests",
    CLIENTS: "/logistics/clients",
    SETTINGS: "/logistics/settings",
    CALENDAR: "/logistics/calendar"
  }
};
