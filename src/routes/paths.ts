export const PATHS = {
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  HOME: "/", // Add HOME path
  DASHBOARD: "/dashboard", // Add DASHBOARD path
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    PARTNERS: "/admin/partners",
    SALES: "/admin/sales",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id: string) => `/admin/payments/${id}`,
    PAYMENT_NEW: "/admin/payments/new", // Add PAYMENT_NEW path
    REPORTS: "/admin/reports",
    FEES: "/admin/fees",
    NOTIFICATIONS: "/admin/notifications",
    CLIENT_DETAILS: (id: string) => `/admin/clients/${id}`,
    CLIENT_NEW: "/admin/clients/new",
    PARTNER_DETAILS: (id: string) => `/admin/partners/${id}`,
    PARTNER_NEW: "/admin/partners/new",
    SALE_DETAILS: (id: string) => `/admin/sales/${id}`,
    SALE_NEW: "/admin/sales/new",
    LOGISTICS: "/admin/logistics",
    MACHINE_DETAILS: (id: string) => `/admin/machines/${id}`,
    MACHINE_NEW: "/admin/machines/new"
  },
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_NEW: "/logistics/machines/new",
    MACHINE_DETAILS: (id: string) => `/logistics/machines/${id}`,
    SUPPORT: "/logistics/support",
    SUPPORT_DETAILS: (id: string) => `/logistics/support/${id}`,
    LOGISTICS_MODULE: "/logistics/operations",
    CLIENTS: "/logistics/clients"
  },
  // Renamed from "CLIENT" to "USER" to fix references
  USER: {
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    PAYMENT_NEW: "/client/payments/new",
    PAYMENT_DETAILS: (id: string) => `/client/payments/${id}`,
    SUPPORT: "/client/support",
    SUPPORT_NEW: "/client/support/new",
    SUPPORT_DETAILS: (id: string) => `/client/support/${id}`,
    PROFILE: "/client/profile",
    SALES: "/client/sales",
    MACHINES: "/client/machines"
  },
  // Keep CLIENT as an alias for backward compatibility
  CLIENT: {
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    PAYMENT_NEW: "/client/payments/new",
    PAYMENT_DETAILS: (id: string) => `/client/payments/${id}`,
    SUPPORT: "/client/support",
    SUPPORT_NEW: "/client/support/new",
    SUPPORT_DETAILS: (id: string) => `/client/support/${id}`,
    PROFILE: "/client/profile",
    SALES: "/client/sales",
    MACHINES: "/client/machines"
  },
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    REQUESTS: "/financial/requests", // Add REQUESTS path
    COMMISSIONS: "/financial/commissions",
    REPORTS: "/financial/reports",
    CLIENTS: "/financial/clients",
    PARTNERS: "/financial/partners" // Add PARTNERS path
  },
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    SALES: "/partner/sales",
    COMMISSIONS: "/partner/commissions",
    SUPPORT: "/partner/support"
  }
};
