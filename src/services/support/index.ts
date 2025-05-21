
// Re-export all from separate files for backward compatibility
export * from './types';
export * from './ticket-api';
export * from './message-api';
export * from './notification-api';

// Export a unified service object (legacy format)
import { 
  createSupportTicket, 
  updateSupportTicket, 
  getSupportTicketById, 
  getSupportTickets, 
  getClientSupportTickets 
} from './ticket-api';
import { getTicketMessages, addTicketMessage } from './message-api';
import { 
  createTicketNotification, 
  createStatusUpdateNotification, 
  createMessageNotification 
} from './notification-api';

// This provides a drop-in replacement for the old service object
export const supportService = {
  createSupportTicket,
  updateSupportTicket,
  getSupportTicketById,
  getSupportTickets,
  getClientSupportTickets,
  getTicketMessages,
  addTicketMessage,
  createTicketNotification,
  createStatusUpdateNotification,
  createMessageNotification
};

export default supportService;
