
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
  notes?: string;
  created_at: string;
  updated_at: string;
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
  byStatus: Record<MachineStatus, number>;
}

export interface MachineNote {
  id: string;
  machine_id: string;
  note: string;
  created_by: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}
