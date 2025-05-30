
export enum MachineStatus {
  ACTIVE = 'ACTIVE',
  STOCK = 'STOCK',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  TRANSIT = 'TRANSIT'
}

export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: MachineStatus;
  client_id?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    business_name: string;
  } | null;
}

export interface MachineTransferParams {
  machine_id: string;
  from_client_id: string | null;
  to_client_id: string;
  cutoff_date: string;
  created_by: string | null;
  notes?: string;
}

export interface MachineTransferRecord {
  id: string;
  machine_id: string;
  from_client_id: string | null;
  to_client_id: string;
  transfer_date: string;
  cutoff_date: string;
  created_by: string | null;
  notes: string | null;
  status: string;
}
