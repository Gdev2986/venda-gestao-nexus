
export const PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PAYMENTS: '/payments',
  PAYMENT_DETAILS: (id = ':id') => `/payments/${id}`,
  PAYMENT_NEW: '/payments/new',
  USER_PAYMENTS: '/payments',  // Changed to be the same as PAYMENTS
  CLIENT_PAYMENTS: '/client-payments',
  CLIENTS: '/clients',
  CLIENT_DETAIL: (id = ':id') => `/clients/${id}`,
  CLIENT_NEW: '/clients/new',
  PARTNERS: '/partners',
  SETTINGS: '/settings',
  FEES: '/fees',
  REPORTS: '/reports',
  SUPPORT: '/support',
  HELP: '/help',
  NOT_FOUND: '/404'
};
