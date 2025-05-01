
/**
 * System path definitions
 * Centralizes all routes for easier maintenance
 */

export const PATHS = {
  // Main pages
  HOME: "/",
  DASHBOARD: "/dashboard",
  
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // Clients
  CLIENTS: "/clients",
  CLIENT_DETAILS: (id: string = ":id") => `/clients/${id}`,
  CLIENT_NEW: "/clients/new",
  
  // Machines
  MACHINES: "/machines",
  MACHINE_DETAILS: (id: string = ":id") => `/machines/${id}`,
  MACHINE_NEW: "/machines/new",
  
  // Sales
  SALES: "/sales",
  SALES_DETAILS: (id: string = ":id") => `/sales/${id}`,
  SALES_NEW: "/sales/new",
  
  // Payments
  PAYMENTS: "/payments",
  PAYMENT_DETAILS: (id: string = ":id") => `/payments/${id}`,
  PAYMENT_NEW: "/payments/new",
  USER_PAYMENTS: "/user-payments", // Route for client payments
  CLIENT_PAYMENTS: "/client-payments", // For sidebar compatibility
  
  // Partners
  PARTNERS: "/partners",
  PARTNER_DETAILS: (id: string = ":id") => `/partners/${id}`,
  PARTNER_NEW: "/partners/new",
  
  // Fees
  FEES: "/fees",
  
  // Reports
  REPORTS: "/reports",
  
  // Settings
  SETTINGS: "/settings",
  USER_MANAGEMENT: "/settings/users",
  
  // Support
  SUPPORT: "/support",

  // Help
  HELP: "/help",
  
  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PAYMENT_REQUESTS: "/admin/payment-requests",
    PAYMENTS: "/admin/payments",
    CLIENTS: "/admin/clients",
    FINANCIAL_REPORTS: "/admin/financial-reports",
    SETTINGS: "/admin/settings",
  },
  
  // Not found
  NOT_FOUND: "*"
};
