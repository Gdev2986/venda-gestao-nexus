
// Complete PATHS object with all necessary path definitions
export const PATHS = {
  // Auth routes
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Client routes
  CLIENT: {
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    SUPPORT: "/client/support",
    HELP: "/client/help",
    SETTINGS: "/client/settings",
    MACHINES: "/client/machines" // Client machines path
  },

  // User routes (alias for CLIENT for backwards compatibility)
  USER: {
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    SUPPORT: "/client/support",
    HELP: "/client/help",
    SETTINGS: "/client/settings",
    MACHINES: "/client/machines"
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: (id: string) => `/admin/clients/${id}`,
    CLIENT_NEW: "/admin/clients/new",
    MACHINES: "/admin/machines",
    MACHINE_DETAILS: (id: string) => `/admin/machines/${id}`,
    MACHINE_NEW: "/admin/machines/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id: string) => `/admin/partners/${id}`,
    PARTNER_NEW: "/admin/partners/new",
    USERS: "/admin/users",
    USER_DETAILS: (id: string) => `/admin/users/${id}`,
    USER_NEW: "/admin/users/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id: string) => `/admin/payments/${id}`,
    PAYMENT_NEW: "/admin/payments/new",
    SETTINGS: "/admin/settings",
    USER_MANAGEMENT: "/admin/settings/users",
    FEES: "/admin/fees",
    SUPPORT: "/admin/support",
    HELP: "/admin/help",
    COMMISSIONS: "/admin/commissions",
    COMMISSION_DETAILS: (id: string) => `/admin/commissions/${id}`,
    COMMISSION_NEW: "/admin/commissions/new",
    SALES: "/admin/sales",
    SALES_DETAILS: (id: string) => `/admin/sales/${id}`,
    SALES_NEW: "/admin/sales/new",
    REPORTS: "/admin/reports",
    LOGISTICS: "/admin/logistics"
  },

  // Partner routes
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id: string) => `/partner/clients/${id}`,
    CLIENT_NEW: "/partner/clients/new",
    SALES: "/partner/sales",
    REPORTS: "/partner/reports",
    SETTINGS: "/partner/settings",
    SUPPORT: "/partner/support",
    HELP: "/partner/help",
    COMMISSIONS: "/partner/commissions"
  },

  // Financial routes
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    REPORTS: "/financial/reports",
    SETTINGS: "/financial/settings"
  },

  // Logistics routes
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_NEW: "/logistics/machines/new",
    MACHINE_DETAILS: (id: string) => `/logistics/machines/${id}`,
    OPERATIONS: "/logistics/operations",
    REQUESTS: "/logistics/requests",
    CLIENTS: "/logistics/clients",
    SETTINGS: "/logistics/settings",
    INVENTORY: "/logistics/inventory",
    CALENDAR: "/logistics/calendar"
  },
  
  // General routes
  DASHBOARD: "/dashboard", // Shortcut/alias to main dashboard
  CLIENTS: "/clients",
  CLIENT_REGISTRATION: "/clients/register",
  HOME: "/"
};
