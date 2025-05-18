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
  };
}

export interface MachineCreateParams {
  serial_number: string;
  model: string;
  status: MachineStatus;
  client_id?: string;
}

export interface MachineUpdateParams {
  serial_number?: string;
  model?: string;
  status?: MachineStatus;
  client_id?: string;
}

export interface MachineTransferParams {
  machine_id: string;
  from_client_id?: string;
  to_client_id: string;
  transfer_date?: string;
  created_by: string;
}

export interface MachineStats {
  total: number;
  stock: number;
  withClients: number;
  byStatus: Record<string, number>;
}

export interface MachineTransferFormProps {
  machineId: string;
  machineName: string;
  currentClientId?: string | null;
  onTransferComplete: () => void;
}
