
export enum MachineStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
  STOCK = "STOCK",
  TRANSIT = "TRANSIT",
  BLOCKED = "BLOCKED" // Added for compatibility with existing code
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: MachineStatus | string;
  client_id?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    business_name: string;
  };
}

export interface MachineCreateParams {
  serial_number: string;
  model: string;
  status: MachineStatus | string;
  client_id?: string;
}

export interface MachineUpdateParams {
  serial_number?: string;
  model?: string;
  status?: MachineStatus | string;
  client_id?: string | null;
}

export interface MachineTransferParams {
  machine_id: string;
  from_client_id: string | null;
  to_client_id: string | null;
  transfer_date?: string;
  created_by: string;
}

export interface MachineStats {
  total: number;
  stock: number;
  withClients: number;
  byStatus: Record<string, number>;
}
