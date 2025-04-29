
import { Client } from "@/types";

// Mock clients data for development
export const mockClients: Client[] = [
  {
    id: "1",
    business_name: "ABC Company",
    document: "12.345.678/0001-90",
    status: "active",
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    business_name: "XYZ Corporation",
    document: "98.765.432/0001-10",
    status: "inactive",
    created_at: "2022-02-01T00:00:00.000Z",
    updated_at: "2022-02-01T00:00:00.000Z",
  },
];

// Function to get a mock client by ID
export const getMockClientById = (id: string): Client | null => {
  return mockClients.find(client => client.id === id) || null;
};
