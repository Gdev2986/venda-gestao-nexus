
export interface PixKey {
  id: string;
  user_id: string;
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
  key: string;
  name: string;
  owner_name?: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}
