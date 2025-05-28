
export const PATHS = {
  // Public routes
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",

  // Admin routes
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: "/admin/clients/:id",
    NEW_CLIENT: "/admin/clients/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: "/admin/partners/:id",
    NEW_PARTNER: "/admin/partners/new",
    PARTNER_CLIENTS: "/admin/partner-clients",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: "/admin/payments/:id",
    SALES: "/admin/sales",
    MACHINES: "/admin/machines",
    FEES: "/admin/fees",
    NOTIFICATIONS: "/admin/notifications",
    SETTINGS: "/admin/settings",
    SUPPORT: "/admin/support",
    REPORTS: "/admin/reports",
    SECURITY: "/admin/security",
    COMPANY: "/admin/company",
    COMPANY_EXPENSES: "/admin/company/expenses",
    COMPANY_REPORTS: "/admin/company/reports",
  },

  // Client routes
  CLIENT: {
    ROOT: "/client",
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    PAYMENT_REQUEST: "/client/payments/request",
    PROFILE: "/client/profile",
    REPORTS: "/client/reports",
    SUPPORT: "/client/support",
    MACHINES: "/client/machines",
    SETTINGS: "/client/settings",
    HELP: "/client/help",
  },

  // Partner routes  
  PARTNER: {
    ROOT: "/partner",
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: "/partner/clients/:id",
    SALES: "/partner/sales",
    COMMISSIONS: "/partner/commissions",
    REPORTS: "/partner/reports",
    SETTINGS: "/partner/settings",
  },

  // Logistics routes
  LOGISTICS: {
    ROOT: "/logistics",
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_DETAILS: "/logistics/machines/:id",
    NEW_MACHINE: "/logistics/machines/new",
    MACHINE_STOCK: "/logistics/machine-stock",
    CLIENT_MACHINES: "/logistics/client-machines",
    REQUESTS: "/logistics/requests",
    SERVICE_REQUESTS: "/logistics/service-requests",
    INVENTORY: "/logistics/inventory",
    OPERATIONS: "/logistics/operations",
    CALENDAR: "/logistics/calendar",
    REPORTS: "/logistics/reports",
    SETTINGS: "/logistics/settings",
    SUPPORT: "/logistics/support",
  },

  // Financial routes
  FINANCIAL: {
    ROOT: "/financial",
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    SETTINGS: "/financial/settings",
  },

  // Generic routes
  DASHBOARD: "/dashboard",
  CLIENTS: "/clients",
  CLIENT_DETAILS: "/clients/:id",
  NEW_CLIENT: "/clients/new",
  PARTNERS: "/partners",
  PARTNER_DETAILS: "/partners/:id",
  NEW_PARTNER: "/partners/new",
  MACHINES: "/machines",
  MACHINE_DETAILS: "/machines/:id",
  NEW_MACHINE: "/machines/new",
  PAYMENTS: "/payments",
  SALES: "/sales",
  NEW_SALE: "/sales/new",
  SALE_DETAILS: "/sales/:id",
  SUPPORT: "/support",
  SETTINGS: "/settings",
  USER_MANAGEMENT: "/settings/user-management",
  HELP: "/help",
  NOTIFICATIONS: "/notifications",
  FEES: "/fees",
  FEE_CALCULATOR: "/fees/calculator",

  // User routes
  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    MACHINES: "/user/machines",
    SUPPORT: "/user/support",
    SETTINGS: "/user/settings",
  },
};
