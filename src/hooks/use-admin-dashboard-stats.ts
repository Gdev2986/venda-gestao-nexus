
// This file is deprecated - functionality moved to SalesContext
// The admin dashboard now uses the shared SalesContext for all data management
// This ensures consistency between the sales page and dashboard, and avoids duplicate API calls

export const useAdminDashboardStats = () => {
  console.warn('useAdminDashboardStats is deprecated. Use SalesContext instead.');
  return {
    stats: null,
    chartsData: null,
    isLoading: false,
    refreshStats: () => {}
  };
};
