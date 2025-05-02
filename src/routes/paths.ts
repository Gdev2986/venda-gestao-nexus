
/**
 * System path definitions
 * Centralizes all routes for easier maintenance
 */

export const PATHS = {
  // Main pages
  HOME: "/",
  
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: (id: string = ":id") => `/admin/clients/${id}`,
    CLIENT_NEW: "/admin/clients/new",
    MACHINES: "/admin/machines",
    MACHINE_DETAILS: (id: string = ":id") => `/admin/machines/${id}`,
    MACHINE_NEW: "/admin/machines/new",
    SALES: "/admin/sales",
    SALES_DETAILS: (id: string = ":id") => `/admin/sales/${id}`,
    SALES_NEW: "/admin/sales/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id: string = ":id") => `/admin/payments/${id}`,
    PAYMENT_NEW: "/admin/payments/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id: string = ":id") => `/admin/partners/${id}`,
    PARTNER_NEW: "/admin/partners/new",
    FEES: "/admin/fees",
    REPORTS: "/admin/reports",
    USERS: "/admin/users",
    COMMISSIONS: "/admin/commissions",
    LOGISTICS: "/admin/logistics",
    NOTIFICATIONS: "/admin/notifications",
    SUPPORT: "/admin/support",
    SETTINGS: "/admin/settings",
    PAYMENT_REQUESTS: "/admin/payment-requests",
    FINANCIAL_REPORTS: "/admin/financial-reports",
  },

  // User (Client) routes
  USER: {
    DASHBOARD: "/user/dashboard",
    MACHINES: "/user/machines",
    PAYMENTS: "/user/payments",
    REPORTS: "/user/reports",
    SUPPORT: "/user/support",
    PROFILE: "/user/profile",
    SETTINGS: "/user/settings",
  },

  // Partner routes
  PARTNER: {
    DASHBOARD: "/partners/dashboard",
    CLIENTS: "/partners/clients",
    SALES: "/partners/sales",
    COMMISSIONS: "/partners/commissions",
    REPORTS: "/partners/reports",
    SUPPORT: "/partners/support",
    SETTINGS: "/partners/settings",
  },

  // Financial routes
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    REQUESTS: "/financial/requests",
    REPORTS: "/financial/reports",
    SUPPORT: "/financial/support",
    SETTINGS: "/financial/settings",
  },

  // Logistics routes
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    REQUESTS: "/logistics/requests",
    REPORTS: "/logistics/reports",
    SUPPORT: "/logistics/support",
    SETTINGS: "/logistics/settings",
  },

  // Legacy routes for backward compatibility - these will redirect to new paths
  DASHBOARD: "/dashboard",
  CLIENTS: "/clients",
  CLIENT_DETAILS: (id: string = ":id") => `/clients/${id}`,
  CLIENT_NEW: "/clients/new",
  MACHINES: "/machines",
  MACHINE_DETAILS: (id: string = ":id") => `/machines/${id}`,
  MACHINE_NEW: "/machines/new",
  SALES: "/sales",
  SALES_DETAILS: (id: string = ":id") => `/sales/${id}`,
  SALES_NEW: "/sales/new",
  PAYMENTS: "/payments",
  PAYMENT_DETAILS: (id: string = ":id") => `/payments/${id}`,
  PAYMENT_NEW: "/payments/new",
  PARTNERS: "/partners",
  PARTNER_DETAILS: (id: string = ":id") => `/partners/${id}`,
  PARTNER_NEW: "/partners/new",
  FEES: "/fees",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  USER_MANAGEMENT: "/settings/users",
  SUPPORT: "/support",
  HELP: "/help",
  USER_PAYMENTS: "/user-payments",
  CLIENT_PAYMENTS: "/client-payments",
  
  // Not found
  NOT_FOUND: "*"
};
