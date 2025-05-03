
/**
 * System path definitions
 * Centralizes all routes for easier maintenance and role-based organization
 */

// Role-based namespaces
const ADMIN = {
  // Main pages
  DASHBOARD: "/admin/dashboard",
  
  // Clients
  CLIENTS: "/admin/clients",
  CLIENT_DETAILS: (id: string = ":id") => `/admin/clients/${id}`,
  CLIENT_NEW: "/admin/clients/new",
  
  // Machines
  MACHINES: "/admin/machines",
  MACHINE_DETAILS: (id: string = ":id") => `/admin/machines/${id}`,
  MACHINE_NEW: "/admin/machines/new",
  
  // Sales
  SALES: "/admin/sales",
  SALES_DETAILS: (id: string = ":id") => `/admin/sales/${id}`,
  SALES_NEW: "/admin/sales/new",
  
  // Payments
  PAYMENTS: "/admin/payments",
  PAYMENT_DETAILS: (id: string = ":id") => `/admin/payments/${id}`,
  PAYMENT_NEW: "/admin/payments/new",
  
  // Partners
  PARTNERS: "/admin/partners",
  PARTNER_DETAILS: (id: string = ":id") => `/admin/partners/${id}`,
  PARTNER_NEW: "/admin/partners/new",
  
  // Fees
  FEES: "/admin/fees",
  
  // Reports
  REPORTS: "/admin/reports",
  
  // Settings
  SETTINGS: "/admin/settings",
  USER_MANAGEMENT: "/admin/settings/users",
  
  // Support
  SUPPORT: "/admin/support",

  // Logistics
  LOGISTICS: "/admin/logistics",
  
  // Help
  HELP: "/admin/help",
};

const USER = {
  // Main pages
  DASHBOARD: "/user/dashboard",
  
  // Payments
  PAYMENTS: "/user/payments",
  USER_PAYMENTS: "/user/payments",
  CLIENT_PAYMENTS: "/user/payments",
  
  // Support
  SUPPORT: "/user/support",
  
  // Settings
  SETTINGS: "/user/settings",
  
  // Help
  HELP: "/user/help",
};

const PARTNER = {
  // Main pages
  DASHBOARD: "/partner/dashboard",
  
  // Clients
  CLIENTS: "/partner/clients",
  CLIENT_DETAILS: (id: string = ":id") => `/partner/clients/${id}`,
  
  // Sales
  SALES: "/partner/sales",
  SALES_DETAILS: (id: string = ":id") => `/partner/sales/${id}`,
  
  // Reports
  REPORTS: "/partner/reports",
  
  // Settings
  SETTINGS: "/partner/settings",
  
  // Support
  SUPPORT: "/partner/support",
  
  // Help
  HELP: "/partner/help",
};

const FINANCIAL = {
  // Main pages
  DASHBOARD: "/financial/dashboard",
  
  // Clients
  CLIENTS: "/financial/clients",
  CLIENT_DETAILS: (id: string = ":id") => `/financial/clients/${id}`,
  CLIENT_NEW: "/financial/clients/new",
  
  // Sales
  SALES: "/financial/sales",
  SALES_DETAILS: (id: string = ":id") => `/financial/sales/${id}`,
  SALES_NEW: "/financial/sales/new",
  
  // Payments
  PAYMENTS: "/financial/payments",
  PAYMENT_DETAILS: (id: string = ":id") => `/financial/payments/${id}`,
  
  // Partners
  PARTNERS: "/financial/partners",
  PARTNER_DETAILS: (id: string = ":id") => `/financial/partners/${id}`,
  PARTNER_NEW: "/financial/partners/new",
  
  // Fees
  FEES: "/financial/fees",
  
  // Reports
  REPORTS: "/financial/reports",
  
  // Settings
  SETTINGS: "/financial/settings",
  
  // Support
  SUPPORT: "/financial/support",
  
  // Help
  HELP: "/financial/help",
};

const LOGISTICS = {
  // Main pages
  DASHBOARD: "/logistics/dashboard",
  
  // Clients
  CLIENTS: "/logistics/clients",
  CLIENT_DETAILS: (id: string = ":id") => `/logistics/clients/${id}`,
  
  // Machines
  MACHINES: "/logistics/machines",
  MACHINE_DETAILS: (id: string = ":id") => `/logistics/machines/${id}`,
  MACHINE_NEW: "/logistics/machines/new",
  
  // Sales
  SALES: "/logistics/sales",
  SALES_DETAILS: (id: string = ":id") => `/logistics/sales/${id}`,
  
  // Logistics specific
  LOGISTICS_MODULE: "/logistics/operations",
  
  // Settings
  SETTINGS: "/logistics/settings",
  
  // Support
  SUPPORT: "/logistics/support",
  
  // Help
  HELP: "/logistics/help",
};

// Auth and common paths that don't require role-based namespacing
const AUTH = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

// Root paths
const ROOT = {
  HOME: "/",
  NOT_FOUND: "*",
};

// Export combined paths
export const PATHS = {
  ...ROOT,
  ...AUTH,
  ADMIN,
  USER,
  PARTNER,
  FINANCIAL,
  LOGISTICS
};

