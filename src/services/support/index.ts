
// Re-export functions from the separate files
export * from "./types";
export * from "./ticket-api";
export * from "./message-api";

// Export functions with renamed aliases for compatibility with existing imports
import { 
  getTickets, 
  getTicketById, 
  getClientTickets, 
  createTicket, 
  updateTicket 
} from "./ticket-api";

export {
  getTickets as getSupportTickets,
  getTicketById as getSupportTicketById,
  getClientTickets as getClientSupportTickets,
  createTicket as createSupportTicket,
  updateTicket as updateSupportTicket
};
