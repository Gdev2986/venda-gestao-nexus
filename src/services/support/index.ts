
// Re-export functions from the separate files
export * from "./types";
export * from "./ticket-api";
export * from "./message-api";
export * from "./notification-api";

// Export functions with renamed aliases for compatibility with existing imports
export const getSupportTickets = getTickets;
export const getSupportTicketById = getTicketById;
export const getClientSupportTickets = getClientTickets;
export const createSupportTicket = createTicket;
export const updateSupportTicket = updateTicket;
