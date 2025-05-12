
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "*",
  
  // User paths
  NOTIFICATIONS: "/notifications",
  
  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    MACHINES: "/user/machines",
    SUPPORT: "/user/support",
    SETTINGS: "/user/settings",
    HELP: "/user/help",
  },
  
  // Admin paths
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: (id?: string) => `/admin/clients/${id || ':id'}`,
    CLIENT_NEW: "/admin/clients/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id?: string) => `/admin/partners/${id || ':id'}`,
    PARTNER_NEW: "/admin/partners/new",
    MACHINES: "/admin/machines",
    MACHINE_DETAILS: (id?: string) => `/admin/machines/${id || ':id'}`,
    MACHINE_NEW: "/admin/machines/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id?: string) => `/admin/payments/${id || ':id'}`,
    PAYMENT_NEW: "/admin/payments/new",
    SALES: "/admin/sales",
    SALES_DETAILS: (id?: string) => `/admin/sales/${id || ':id'}`,
    SALES_NEW: "/admin/sales/new",
    REPORTS: "/admin/reports",
    NOTIFICATIONS: "/admin/notifications",
    SUPPORT: "/admin/support",
    SETTINGS: "/admin/settings",
    FEES: "/admin/fees",
    USER_MANAGEMENT: "/admin/settings/users",
  },
  
  // Partner paths
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id?: string) => `/partner/clients/${id || ':id'}`,
    SALES: "/partner/sales",
    COMMISSIONS: "/partner/commissions",
    REPORTS: "/partner/reports",
    SETTINGS: "/partner/settings",
    SUPPORT: "/partner/support", // Added missing support path
    HELP: "/partner/help", // Added missing help path
  },
  
  // Logistics paths
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_STOCK: "/logistics/machines/stock",
    MACHINE_NEW: "/logistics/machines/new", // Added missing machine new path
    MACHINE_DETAILS: (id?: string) => `/logistics/machines/${id || ':id'}`, // Added missing machine details path
    CLIENT_MACHINES: "/logistics/client-machines",
    CLIENTS: "/logistics/clients",
    REQUESTS: "/logistics/requests",
    SERVICE_REQUESTS: "/logistics/service",
    CALENDAR: "/logistics/calendar",
    INVENTORY: "/logistics/inventory",
    OPERATIONS: "/logistics/operations",
    SUPPORT: "/logistics/support",
    SETTINGS: "/logistics/settings",
  },
  
  // Financial paths
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    PAYMENT_REQUESTS: "/financial/payment-requests",
    SETTINGS: "/financial/settings",
    REPORTS: "/financial/reports", // Added missing reports path
    REQUESTS: "/financial/requests", // Added missing requests path
    CLIENTS: "/financial/clients", // Added missing clients path
  },
};
