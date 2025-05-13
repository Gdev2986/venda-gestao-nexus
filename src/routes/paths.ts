
// Function to create client detail paths
const clientDetailsPath = (id?: string) => `/admin/clients/${id || ':id'}`;
const partnerDetailsPath = (id?: string) => `/admin/partners/${id || ':id'}`;

// Unified paths for the application
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  NOTIFICATIONS: "/notifications",
  DASHBOARD: "/dashboard", // Generic dashboard redirect
  NOT_FOUND: "/404",

  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    MACHINES: "/user/machines",
    SUPPORT: "/user/support",
    SETTINGS: "/user/settings",
    HELP: "/user/help"
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: clientDetailsPath,
    CLIENT_NEW: "/admin/clients/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: partnerDetailsPath,
    PARTNER_NEW: "/admin/partners/new",
    MACHINES: "/admin/machines",
    MACHINE_NEW: "/admin/machines/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_NEW: "/admin/payments/new",
    PAYMENT_DETAILS: (id?: string) => `/admin/payments/${id || ':id'}`,
    SALES: "/admin/sales",
    FEES: "/admin/fees",
    REPORTS: "/admin/reports",
    NOTIFICATIONS: "/admin/notifications",
    SETTINGS: "/admin/settings",
    LOGISTICS: "/admin/logistics",
    SUPPORT: "/admin/support",
    USER_MANAGEMENT: "/admin/settings/users"
  },

  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id?: string) => `/partner/clients/${id || ':id'}`,
    SALES: "/partner/sales",
    COMMISSIONS: "/partner/commissions",
    REPORTS: "/partner/reports",
    SETTINGS: "/partner/settings",
    SUPPORT: "/partner/support",
    HELP: "/partner/help"
  },

  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_STOCK: "/logistics/machines/stock",
    MACHINE_NEW: "/logistics/machines/new",
    CLIENT_MACHINES: "/logistics/machines/clients",
    CLIENTS: "/logistics/clients",
    REQUESTS: "/logistics/requests",
    SERVICE_REQUESTS: "/logistics/service-requests",
    CALENDAR: "/logistics/calendar",
    INVENTORY: "/logistics/inventory",
    OPERATIONS: "/logistics/operations",
    SUPPORT: "/logistics/support",
    SETTINGS: "/logistics/settings"
  },

  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    PAYMENT_REQUESTS: "/financial/payment-requests",
    SETTINGS: "/financial/settings",
    CLIENTS: "/financial/clients",
    REPORTS: "/financial/reports",
    REQUESTS: "/financial/requests"
  }
};
