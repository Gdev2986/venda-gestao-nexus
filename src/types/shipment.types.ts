
export interface Shipment {
  id: string;
  client_id: string;
  item_type: 'machine' | 'bobina' | 'other';
  item_description: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_code?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  delivered_at?: string;
  // Joined data
  client?: {
    id: string;
    business_name: string;
  };
  creator?: {
    id: string;
    name: string;
  };
}

export interface ShipmentActivity {
  id: string;
  shipment_id: string;
  user_id: string;
  action_type: 'created' | 'status_changed' | 'tracking_updated' | 'delivered' | 'cancelled' | 'notes_updated';
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  // Joined data
  user?: {
    id: string;
    name: string;
  };
}

export interface CreateShipmentData {
  client_id: string;
  item_type: 'machine' | 'bobina' | 'other';
  item_description: string;
  status?: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_code?: string;
  notes?: string;
}

export interface UpdateShipmentData {
  item_description?: string;
  status?: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_code?: string;
  notes?: string;
}
