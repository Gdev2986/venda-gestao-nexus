
export enum MachineStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
  BLOCKED = "BLOCKED"
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: MachineStatus;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MachineWithClient extends Machine {
  client?: {
    id: string;
    business_name: string;
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
  from_client_id?: string;
  to_client_id: string;
  notes?: string;
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
  byClient: {
    client_id: string;
    client_name: string;
    count: number;
  }[];
  byModel: {
    model: string;
    count: number;
  }[];
}
