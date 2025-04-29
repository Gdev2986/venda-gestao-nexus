
import { Client } from "@/types";

// Mock clients data for development
export const mockClients: Client[] = [
  {
    id: "1",
    business_name: "ABC Company",
    contact_name: "John Doe",
    email: "john@example.com",
    phone: "(11) 99999-9999",
    address: "123 Main St",
    city: "São Paulo",
    state: "SP",
    zip: "01234-567",
    document: "12.345.678/0001-90",
    status: "active",
    created_at: "2022-01-01T00:00:00.000Z",
    updated_at: "2022-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    business_name: "XYZ Corporation",
    contact_name: "Jane Smith",
    email: "jane@example.com",
    phone: "(11) 88888-8888",
    address: "456 Second Ave",
    city: "Rio de Janeiro",
    state: "RJ",
    zip: "20000-000",
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
