import { Client } from "@/types";

// Utility function to generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Utility function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Utility function to generate a random date within a range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const mockClients: any[] = [
  {
    id: "cl-001",
    business_name: "Tech Solutions Ltd",
    company_name: "Tech Solutions Ltd",
    contact_name: "John Doe",
    email: "john@techsolutions.com",
    phone: "11 99999-0001",
    document: "12.345.678/0001-01",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    postal_code: "01310-100",
    zip: "01310-100",
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z",
    status: "ACTIVE",
  },
  {
    id: "cl-002",
    business_name: "Marketing Express",
    company_name: "Marketing Express",
    contact_name: "Maria Silva",
    email: "maria@marketingexpress.com",
    phone: "11 99999-0002",
    document: "23.456.789/0001-02",
    address: "Rua Augusta, 500",
    city: "São Paulo",
    state: "SP",
    postal_code: "01304-000",
    zip: "01304-000",
    created_at: "2023-02-20T00:00:00Z",
    updated_at: "2023-02-20T00:00:00Z",
    status: "INACTIVE",
  },
  {
    id: "cl-003",
    business_name: "Global Imports",
    company_name: "Global Imports",
    contact_name: "Carlos Pereira",
    email: "carlos@globalimports.com",
    phone: "11 99999-0003",
    document: "34.567.890/0001-03",
    address: "Av. Brigadeiro Faria Lima, 2000",
    city: "São Paulo",
    state: "SP",
    postal_code: "01451-000",
    zip: "01451-000",
    created_at: "2023-03-25T00:00:00Z",
    updated_at: "2023-03-25T00:00:00Z",
    status: "ACTIVE",
  },
  {
    id: "cl-004",
    business_name: "Data Solutions Inc.",
    company_name: "Data Solutions Inc.",
    contact_name: "Ana Souza",
    email: "ana@datasolutions.com",
    phone: "11 99999-0004",
    document: "45.678.901/0001-04",
    address: "Rua da Consolação, 1500",
    city: "São Paulo",
    state: "SP",
    postal_code: "01301-100",
    zip: "01301-100",
    created_at: "2023-04-30T00:00:00Z",
    updated_at: "2023-04-30T00:00:00Z",
    status: "ACTIVE",
  },
  {
    id: "cl-005",
    business_name: "Energy Plus Ltda.",
    company_name: "Energy Plus Ltda.",
    contact_name: "Ricardo Almeida",
    email: "ricardo@energyplus.com",
    phone: "11 99999-0005",
    document: "56.789.012/0001-05",
    address: "Av. Rebouças, 2500",
    city: "São Paulo",
    state: "SP",
    postal_code: "01449-000",
    zip: "01449-000",
    created_at: "2023-05-05T00:00:00Z",
    updated_at: "2023-05-05T00:00:00Z",
    status: "INACTIVE",
  },
];

// Function to get a mock client by ID
export const getMockClientById = (id: string): Client | undefined => {
  return mockClients.find(client => client.id === id);
};
