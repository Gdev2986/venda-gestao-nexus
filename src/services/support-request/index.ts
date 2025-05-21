
// Re-export all from separate files for backward compatibility
export * from './types';
export * from './ticket-api';
export * from './message-api';
export * from './stats';

// Export a unified service object (legacy format)
import { createTicket, updateTicket, getTickets } from './ticket-api';
import { getTicketMessages, addMessage } from './message-api';
import { getStats } from './stats';

// This provides a drop-in replacement for the old service object
export const SupportRequestService = {
  createTicket,
  updateTicket,
  getTickets,
  getTicketMessages,
  addMessage,
  getStats
};

export default SupportRequestService;
