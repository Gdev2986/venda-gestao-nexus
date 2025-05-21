
export async function getRequestStats() {
  // Stats data to be compatible with existing code
  return {
    pendingRequests: 12,
    highPriorityRequests: 5,
    typeCounts: {
      INSTALLATION: 4,
      MAINTENANCE: 6,
      REPLACEMENT: 2,
      OTHER: 3
    },
    totalRequests: 15
  };
}
