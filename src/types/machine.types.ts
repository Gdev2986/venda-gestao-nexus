
export enum MachineStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
  BLOCKED = "BLOCKED",
  STOCK = "STOCK",
  TRANSIT = "TRANSIT"
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: MachineStatus;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  client?: {
    id: string;
    business_name: string;
    address?: string;
    city?: string;
    state?: string;
  };
}

export interface MachineCreateParams {
  serial_number: string;
  model: string;
  status?: MachineStatus;
  client_id?: string;
}

export interface MachineUpdateParams {
  serial_number?: string;
  model?: string;
  status?: MachineStatus;
  client_id?: string | null;
}

export interface MachineTransferParams {
  machine_id: string;
  from_client_id: string | null;
  to_client_id: string;
  created_by: string;
}

export interface MachineTransfer {
  id: string;
  machine_id: string;
  from_client_id?: string;
  to_client_id: string;
  transfer_date: string;
  cutoff_date: string;
  created_by: string;
  created_at: string;
  machine?: Machine;
  from_client?: {
    id: string;
    business_name: string;
  };
  to_client?: {
    id: string;
    business_name: string;
  };
}

export interface MachineStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  stock: number;
  transit: number;
  blocked: number;
  by_model?: Record<string, number>;
}
