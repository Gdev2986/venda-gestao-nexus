
export interface PixKey {
  id: string;
  user_id: string;
  key: string;
  type: string;
  name: string;
  owner_name?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';
