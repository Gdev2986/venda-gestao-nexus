
// Re-export all from separate files for backward compatibility
export * from './types';
export * from './ticket-api';
export * from './message-api';
// We need to rename getRequestStats to avoid the ambiguity
import { getRequestStats as getTicketStats } from './stats';
export { getTicketStats };

// Export a unified service object (legacy format)
import { createRequest, updateRequest, getAllRequests } from './ticket-api';
import { getTicketMessages, addMessage } from './message-api';
import { getRequestStats } from './stats';

// This provides a drop-in replacement for the old service object
export const SupportRequestService = {
  createTicket: createRequest,
  updateTicket: updateRequest,
  getTickets: getAllRequests,
  getTicketMessages,
  addMessage,
  getStats: getRequestStats
};

export default SupportRequestService;
