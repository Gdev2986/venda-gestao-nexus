export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_logs: {
        Row: {
          acted_by: string | null
          action: string
          after_role: Database["public"]["Enums"]["user_role"] | null
          before_role: Database["public"]["Enums"]["user_role"] | null
          created_at: string | null
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          acted_by?: string | null
          action: string
          after_role?: Database["public"]["Enums"]["user_role"] | null
          before_role?: Database["public"]["Enums"]["user_role"] | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          acted_by?: string | null
          action?: string
          after_role?: Database["public"]["Enums"]["user_role"] | null
          before_role?: Database["public"]["Enums"]["user_role"] | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          business_name: string
          created_at: string | null
          document: string | null
          id: string
          partner_id: string | null
          updated_at: string | null
        }
        Insert: {
          business_name: string
          created_at?: string | null
          document?: string | null
          id: string
          partner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string | null
          document?: string | null
          id?: string
          partner_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          is_paid: boolean | null
          paid_at: string | null
          partner_id: string
          sale_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          paid_at?: string | null
          partner_id: string
          sale_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          paid_at?: string | null
          partner_id?: string
          sale_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_transfers: {
        Row: {
          created_at: string | null
          created_by: string
          cutoff_date: string
          from_client_id: string | null
          id: string
          machine_id: string
          to_client_id: string
          transfer_date: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          cutoff_date?: string
          from_client_id?: string | null
          id?: string
          machine_id: string
          to_client_id: string
          transfer_date?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          cutoff_date?: string
          from_client_id?: string | null
          id?: string
          machine_id?: string
          to_client_id?: string
          transfer_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_transfers_from_client_id_fkey"
            columns: ["from_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_transfers_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_transfers_to_client_id_fkey"
            columns: ["to_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          model: string
          serial_number: string
          status: Database["public"]["Enums"]["machine_status"]
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          model: string
          serial_number: string
          status?: Database["public"]["Enums"]["machine_status"]
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          model?: string
          serial_number?: string
          status?: Database["public"]["Enums"]["machine_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          commission_rate: number
          company_name: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number
          company_name: string
          created_at?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number
          company_name?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          client_id: string
          created_at: string | null
          id: string
          pix_key_id: string
          receipt_url: string | null
          status: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          pix_key_id: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          pix_key_id?: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_pix_key_id_fkey"
            columns: ["pix_key_id"]
            isOneToOne: false
            referencedRelation: "pix_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      pix_keys: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          key: string
          name: string
          type: Database["public"]["Enums"]["pix_key_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          key: string
          name: string
          type: Database["public"]["Enums"]["pix_key_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          key?: string
          name?: string
          type?: Database["public"]["Enums"]["pix_key_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          client_id: string
          code: string
          created_at: string | null
          date: string
          gross_amount: number
          id: string
          machine_id: string | null
          net_amount: number
          partner_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          processing_status:
            | Database["public"]["Enums"]["processing_status"]
            | null
          terminal: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          code: string
          created_at?: string | null
          date: string
          gross_amount: number
          id?: string
          machine_id?: string | null
          net_amount: number
          partner_id?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          terminal: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          code?: string
          created_at?: string | null
          date?: string
          gross_amount?: number
          id?: string
          machine_id?: string | null
          net_amount?: number
          partner_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          terminal?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_client_balance: {
        Row: {
          balance: number | null
          client_id: string | null
          total_sales: number | null
          yesterday_gross: number | null
          yesterday_net: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      machine_status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "BLOCKED"
      notification_type:
        | "PAYMENT"
        | "BALANCE"
        | "MACHINE"
        | "COMMISSION"
        | "SYSTEM"
      payment_method: "CREDIT" | "DEBIT" | "PIX"
      payment_request_status: "PENDING" | "APPROVED" | "PAID" | "REJECTED"
      pix_key_type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM"
      processing_status: "RAW" | "PROCESSED"
      user_role: "ADMIN" | "FINANCIAL" | "PARTNER" | "CLIENT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      machine_status: ["ACTIVE", "INACTIVE", "MAINTENANCE", "BLOCKED"],
      notification_type: [
        "PAYMENT",
        "BALANCE",
        "MACHINE",
        "COMMISSION",
        "SYSTEM",
      ],
      payment_method: ["CREDIT", "DEBIT", "PIX"],
      payment_request_status: ["PENDING", "APPROVED", "PAID", "REJECTED"],
      pix_key_type: ["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"],
      processing_status: ["RAW", "PROCESSED"],
      user_role: ["ADMIN", "FINANCIAL", "PARTNER", "CLIENT"],
    },
  },
} as const
