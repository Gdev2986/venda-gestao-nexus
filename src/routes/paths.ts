
export const PATHS = {
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: (id: string) => `/admin/clients/${id}`,
    CLIENT_NEW: "/admin/clients/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id: string) => `/admin/partners/${id}`,
    PARTNER_NEW: "/admin/partners/new",
    SALES: "/admin/sales",
    SALE_DETAILS: (id: string) => `/admin/sales/${id}`,
    MACHINES: "/admin/machines",
    MACHINE_DETAILS: (id: string) => `/admin/machines/${id}`,
    MACHINE_NEW: "/admin/machines/new",
    FEES: "/admin/fees",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
    USER_MANAGEMENT: "/admin/settings/users",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id: string) => `/admin/payments/${id}`,
    PAYMENT_NEW: "/admin/payments/new"
  },
  CLIENT: {
    DASHBOARD: "/client/dashboard",
    MACHINES: "/client/machines",
    MACHINE_DETAILS: (id: string) => `/client/machines/${id}`,
    PAYMENTS: "/client/payments",
    PAYMENT_DETAILS: (id: string) => `/client/payments/${id}`,
    PAYMENT_NEW: "/client/payments/new",
    SUPPORT: "/client/support",
    SETTINGS: "/client/settings"
  },
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id: string) => `/partner/clients/${id}`,
    COMMISSIONS: "/partner/commissions",
    SETTINGS: "/partner/settings"
  },
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    REQUESTS: "/financial/requests",
    REQUEST_DETAILS: (id: string) => `/financial/requests/${id}`,
    REPORTS: "/financial/reports"
  },
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    OPERATIONS: "/logistics/operations",
    SUPPORT: "/logistics/support"
  },
  SETTINGS: "/settings",
  PAYMENTS: "/payments"
};
