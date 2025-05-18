
export enum MachineStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
  BLOCKED = "BLOCKED",
  TRANSIT = "TRANSIT",
  STOCK = "STOCK"
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: MachineStatus;
  client_id?: string;
  client_name?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  serialNumber?: string;
  notes?: string;
  client?: {
    id: string;
    business_name: string;
  };
}

export interface MachineStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  blocked: number;
  stock: number;
  transit: number;
  byStatus: Record<string, number>;
  byClient?: Record<string, number>;
  byModel?: Record<string, number>;
}

export interface MachineTransfer {
  id: string;
  machine_id: string;
  from_client_id: string;
  to_client_id: string;
  transfer_date: string;
  cutoff_date?: string;
  created_at: string;
  created_by: string;
  machine?: Machine;
  from_client: {
    id: string;
    business_name: string;
  };
  to_client: {
    id: string;
    business_name: string;
  };
}

export interface MachineTransferParams {
  machine_id: string;
  from_client_id?: string;
  to_client_id: string;
  cutoff_date?: string;
  created_by?: string;
}

export interface MachineCreateParams {
  serial_number: string;
  model: string;
  status?: MachineStatus;
  client_id?: string;
  notes?: string;
}

export interface MachineUpdateParams {
  serial_number?: string;
  model?: string;
  status?: MachineStatus;
  client_id?: string | null;
  notes?: string;
}
