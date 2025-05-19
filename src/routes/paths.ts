
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  RECOVER_PASSWORD: "/recover-password",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  CONTACT: "/contact",
  ABOUT: "/about",
  FEATURES: "/features",
  PRICING: "/pricing",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "/404",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CLIENTS: "/admin/clients",
    CLIENT_NEW: "/admin/clients/new",
    CLIENT_DETAILS: (id?: string) =>
      id ? `/admin/clients/${id}` : "/admin/clients/:id",
    MACHINES: "/admin/machines",
    PARTNERS: "/admin/partners",
    PARTNER_NEW: "/admin/partners/new",
    PARTNER_DETAILS: (id?: string) =>
      id ? `/admin/partners/${id}` : "/admin/partners/:id",
    PAYMENTS: "/admin/payments",
    PAYMENT_NEW: "/admin/payments/new",
    PAYMENT_DETAILS: (id?: string) =>
      id ? `/admin/payments/${id}` : "/admin/payments/:id",
    PAYMENT_REQUESTS: "/admin/payment-requests",
    PAYMENT_REQUEST_DETAILS: (id?: string) =>
      id ? `/admin/payment-requests/${id}` : "/admin/payment-requests/:id",
    COMMISSIONS: "/admin/commissions",
    COMMISSION_DETAILS: (id?: string) =>
      id ? `/admin/commissions/${id}` : "/admin/commissions/:id",
    SETTINGS: "/admin/settings",
    LOGISTICS: "/admin/logistics",
    SUPPORT: "/admin/support",
    SALES: "/admin/sales",
    SALES_DETAILS: (id?: string) =>
      id ? `/admin/sales/${id}` : "/admin/sales/:id",
    SALES_NEW: "/admin/sales/new",
    REPORTS: "/admin/reports",
    FEES: "/admin/fees",
    USER_MANAGEMENT: "/admin/users/management",
  },
  CLIENT: {
    DASHBOARD: "/client/dashboard",
    SALES: "/client/sales",
    SALES_DETAILS: (id?: string) => (id ? `/client/sales/${id}` : '/client/sales/:id'),
    PAYMENTS: "/client/payments",
    PAYMENT_DETAILS: (id?: string) => (id ? `/client/payments/${id}` : '/client/payments/:id'),
    SUPPORT: "/client/support",
    SETTINGS: "/client/settings",
    PROFILE: "/client/profile",
    COMMISSIONS: "/client/commissions",
    MACHINES: "/client/machines",
  },
  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    SUPPORT: "/user/support",
    SETTINGS: "/user/settings",
    HELP: "/user/help",
    MACHINES: "/user/machines",
  },
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_NEW: "/partner/clients/new",
    CLIENT_DETAILS: (id?: string) =>
      id ? `/partner/clients/${id}` : "/partner/clients/:id",
    SALES: "/partner/sales",
    COMMISSIONS: "/partner/commissions",
    COMMISSION_DETAILS: (id?: string) =>
      id ? `/partner/commissions/${id}` : "/partner/commissions/:id",
    PAYMENTS: "/partner/payments",
    PAYMENT_DETAILS: (id?: string) =>
      id ? `/partner/payments/${id}` : "/partner/payments/:id",
    SUPPORT: "/partner/support",
    SETTINGS: "/partner/settings",
    REPORTS: "/partner/reports",
    HELP: "/partner/help",
  },
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    PAYMENT_NEW: "/financial/payments/new",
    PAYMENT_DETAILS: (id?: string) =>
      id ? `/financial/payments/${id}` : "/financial/payments/:id",
    PAYMENT_REQUESTS: "/financial/payment-requests",
    PAYMENT_REQUEST_DETAILS: (id?: string) =>
      id ? `/financial/payment-requests/${id}` : "/financial/payment-requests/:id",
    COMMISSIONS: "/financial/commissions",
    COMMISSION_DETAILS: (id?: string) =>
      id ? `/financial/commissions/${id}` : "/financial/commissions/:id",
    CLIENTS: "/financial/clients",
    PARTNERS: "/financial/partners",
    SETTINGS: "/financial/settings",
    REPORTS: "/financial/reports",
    REQUESTS: "/financial/requests",
  },
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_NEW: "/logistics/machines/new",
    MACHINE_DETAILS: (id?: string) =>
      id ? `/logistics/machines/${id}` : "/logistics/machines/:id",
    OPERATIONS: "/logistics/operations",
    REQUESTS: "/logistics/requests",
    INVENTORY: "/logistics/inventory",
    CLIENTS: "/logistics/clients",
    SETTINGS: "/logistics/settings",
    CALENDAR: "/logistics/calendar",
    REPORTS: "/logistics/reports"
  },
  SUPPORT: {
    DASHBOARD: "/support/dashboard",
    TICKETS: "/support/tickets",
    TICKET_DETAILS: (id?: string) =>
      id ? `/support/tickets/${id}` : "/support/tickets/:id",
    CLIENTS: "/support/clients",
    SETTINGS: "/support/settings",
  }
} as const;
