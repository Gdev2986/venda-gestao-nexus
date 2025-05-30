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
      auth_audit_logs: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      balance_changes: {
        Row: {
          amount_changed: number
          changed_by: string
          client_id: string
          created_at: string
          id: string
          new_balance: number
          previous_balance: number
          reason: string
        }
        Insert: {
          amount_changed: number
          changed_by: string
          client_id: string
          created_at?: string
          id?: string
          new_balance: number
          previous_balance: number
          reason: string
        }
        Update: {
          amount_changed?: number
          changed_by?: string
          client_id?: string
          created_at?: string
          id?: string
          new_balance?: number
          previous_balance?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "balance_changes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balance_changes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_fee_plans: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          client_id: string
          fee_plan_id: string
          id: string
          notes: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          client_id: string
          fee_plan_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          client_id?: string
          fee_plan_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_fee_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_fee_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_fee_plans_fee_plan_id_fkey"
            columns: ["fee_plan_id"]
            isOneToOne: false
            referencedRelation: "fee_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      client_logs: {
        Row: {
          action_type: string
          changed_by: string
          client_id: string
          created_at: string | null
          id: string
          new_value: Json | null
          previous_value: Json | null
        }
        Insert: {
          action_type: string
          changed_by: string
          client_id: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Update: {
          action_type?: string
          changed_by?: string
          client_id?: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "client_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_tax_blocks: {
        Row: {
          block_id: string
          client_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          block_id: string
          client_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          block_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tax_blocks_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "tax_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tax_blocks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tax_blocks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          balance: number | null
          business_name: string
          city: string | null
          contact_name: string | null
          created_at: string | null
          document: string | null
          email: string | null
          fee_plan_id: string | null
          id: string
          partner_id: string | null
          phone: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          balance?: number | null
          business_name: string
          city?: string | null
          contact_name?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          fee_plan_id?: string | null
          id?: string
          partner_id?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          balance?: number | null
          business_name?: string
          city?: string | null
          contact_name?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          fee_plan_id?: string | null
          id?: string
          partner_id?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip?: string | null
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
      fee_plan_rates: {
        Row: {
          created_at: string | null
          fee_plan_id: string
          id: string
          installments: number
          payment_method: string
          rate_percentage: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fee_plan_id: string
          id?: string
          installments?: number
          payment_method: string
          rate_percentage: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fee_plan_id?: string
          id?: string
          installments?: number
          payment_method?: string
          rate_percentage?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_plan_rates_fee_plan_id_fkey"
            columns: ["fee_plan_id"]
            isOneToOne: false
            referencedRelation: "fee_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      machine_transfers: {
        Row: {
          created_at: string | null
          created_by: string
          cutoff_date: string
          from_client_id: string | null
          id: string
          machine_id: string
          notes: string | null
          status: string | null
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
          notes?: string | null
          status?: string | null
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
          notes?: string | null
          status?: string | null
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
            foreignKeyName: "machine_transfers_from_client_id_fkey"
            columns: ["from_client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
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
          {
            foreignKeyName: "machine_transfers_to_client_id_fkey"
            columns: ["to_client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
        ]
      }
      machines: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          model: string
          notes: string | null
          serial_number: string
          status: Database["public"]["Enums"]["machine_status"]
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          model: string
          notes?: string | null
          serial_number: string
          status?: Database["public"]["Enums"]["machine_status"]
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          model?: string
          notes?: string | null
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
          {
            foreignKeyName: "machines_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
        ]
      }
      notification_history: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          notification_id: string | null
          read_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_history_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          admin_messages: boolean
          created_at: string
          id: string
          payment_status_updates: boolean
          payments_received: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_messages?: boolean
          created_at?: string
          id?: string
          payment_status_updates?: boolean
          payments_received?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_messages?: boolean
          created_at?: string
          id?: string
          payment_status_updates?: boolean
          payments_received?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          description: string | null
          id: string
          pix_key_id: string
          receipt_url: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          client_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          pix_key_id: string
          receipt_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          pix_key_id?: string
          receipt_url?: string | null
          rejection_reason?: string | null
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
            foreignKeyName: "payment_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
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
          owner_name: string | null
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
          owner_name?: string | null
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
          owner_name?: string | null
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
          password_reset_required: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string
          temp_access_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          password_reset_required?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          temp_access_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_reset_required?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          temp_access_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          code: string
          created_at: string | null
          date: string
          gross_amount: number
          id: string
          installments: number | null
          machine_id: string | null
          net_amount: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          processing_status:
            | Database["public"]["Enums"]["processing_status"]
            | null
          source: string | null
          terminal: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          date: string
          gross_amount: number
          id?: string
          installments?: number | null
          machine_id?: string | null
          net_amount: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          source?: string | null
          terminal: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          date?: string
          gross_amount?: number
          id?: string
          installments?: number | null
          machine_id?: string | null
          net_amount?: number
          payment_method?: Database["public"]["Enums"]["payment_method"]
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          source?: string | null
          terminal?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_date_range: {
        Row: {
          earliest_date: string
          id: string
          last_updated: string | null
          latest_date: string
          total_records: number | null
        }
        Insert: {
          earliest_date: string
          id?: string
          last_updated?: string | null
          latest_date: string
          total_records?: number | null
        }
        Update: {
          earliest_date?: string
          id?: string
          last_updated?: string | null
          latest_date?: string
          total_records?: number | null
        }
        Relationships: []
      }
      sales_metadata: {
        Row: {
          created_at: string | null
          id: string
          metric_date: string
          total_amount: number | null
          total_sales: number | null
          unique_terminals: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_date: string
          total_amount?: number | null
          total_sales?: number | null
          unique_terminals?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_date?: string
          total_amount?: number | null
          total_sales?: number | null
          unique_terminals?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          source_ip: unknown | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source_ip?: unknown | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source_ip?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      support_conversations: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
        ]
      }
      support_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "support_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      support_requests: {
        Row: {
          client_id: string
          created_at: string | null
          description: string
          id: string
          priority: Database["public"]["Enums"]["support_request_priority"]
          resolution: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["support_request_status"]
          technician_id: string | null
          title: string
          type: Database["public"]["Enums"]["support_request_type"]
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          description: string
          id?: string
          priority: Database["public"]["Enums"]["support_request_priority"]
          resolution?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["support_request_status"]
          technician_id?: string | null
          title: string
          type: Database["public"]["Enums"]["support_request_type"]
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["support_request_priority"]
          resolution?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["support_request_status"]
          technician_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["support_request_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "support_requests_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_blocks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tax_rates: {
        Row: {
          block_id: string
          created_at: string | null
          final_rate: number
          forwarding_rate: number
          id: string
          installment: number
          payment_method: string
          root_rate: number
          updated_at: string | null
        }
        Insert: {
          block_id: string
          created_at?: string | null
          final_rate: number
          forwarding_rate: number
          id?: string
          installment: number
          payment_method: string
          root_rate: number
          updated_at?: string | null
        }
        Update: {
          block_id?: string
          created_at?: string | null
          final_rate?: number
          forwarding_rate?: number
          id?: string
          installment?: number
          payment_method?: string
          root_rate?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_rates_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "tax_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_client_access: {
        Row: {
          client_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_client_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_client_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_balance"
            referencedColumns: ["client_id"]
          },
        ]
      }
      user_first_login: {
        Row: {
          created_at: string | null
          first_login_at: string | null
          id: string
          password_changed_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_login_at?: string | null
          id?: string
          password_changed_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_login_at?: string | null
          id?: string
          password_changed_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser_info: string | null
          created_at: string
          device_id: string
          id: string
          is_mobile: boolean | null
          is_revoked: boolean | null
          last_active: string
          location_country: string | null
          metadata: Json | null
          os_info: string | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          browser_info?: string | null
          created_at?: string
          device_id: string
          id?: string
          is_mobile?: boolean | null
          is_revoked?: boolean | null
          last_active?: string
          location_country?: string | null
          metadata?: Json | null
          os_info?: string | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          browser_info?: string | null
          created_at?: string
          device_id?: string
          id?: string
          is_mobile?: boolean | null
          is_revoked?: boolean | null
          last_active?: string
          location_country?: string | null
          metadata?: Json | null
          os_info?: string | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      vw_client_balance: {
        Row: {
          balance: number | null
          business_name: string | null
          client_id: string | null
          total_gross_amount: number | null
          total_net_amount: number | null
          total_sales: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_client_sales_with_transfers: {
        Args: {
          p_client_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: {
          sale_id: string
          code: string
          terminal: string
          date: string
          gross_amount: number
          net_amount: number
          payment_method: string
          machine_id: string
          machine_serial: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_dates_with_sales: {
        Args: Record<PropertyKey, never>
        Returns: {
          sale_date: string
        }[]
      }
      get_machine_transfer_history: {
        Args: { p_machine_id: string }
        Returns: {
          transfer_id: string
          from_client_id: string
          from_client_name: string
          to_client_id: string
          to_client_name: string
          transfer_date: string
          cutoff_date: string
          created_by: string
          notes: string
        }[]
      }
      get_paginated_sales: {
        Args: {
          page_number?: number
          page_size?: number
          filter_date_start?: string
          filter_date_end?: string
          filter_hour_start?: string
          filter_hour_end?: string
          filter_terminals?: string[]
          filter_payment_type?: string
          filter_source?: string
        }
        Returns: {
          id: string
          code: string
          terminal: string
          date: string
          gross_amount: number
          net_amount: number
          payment_method: string
          installments: number
          source: string
          total_count: number
        }[]
      }
      get_sales_date_range: {
        Args: Record<PropertyKey, never>
        Returns: {
          earliest_date: string
          latest_date: string
          total_records: number
        }[]
      }
      get_sales_paginated: {
        Args: {
          page_number?: number
          page_size?: number
          filter_date_start?: string
          filter_date_end?: string
          filter_hour_start?: number
          filter_hour_end?: number
          filter_terminals?: string[]
          filter_payment_type?: string
          filter_status?: string
          filter_source?: string
        }
        Returns: {
          id: string
          code: string
          terminal: string
          date: string
          gross_amount: number
          net_amount: number
          payment_method: string
          installments: number
          source: string
          total_count: number
        }[]
      }
      get_user_client_balance: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_user_client_id: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      send_notification_to_roles: {
        Args: {
          notification_title: string
          notification_message: string
          notification_type: string
          target_roles: string[]
          notification_data?: Json
        }
        Returns: number
      }
      send_notification_to_user: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
          notification_type: string
          notification_data?: Json
        }
        Returns: boolean
      }
      update_user_after_password_change: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      user_needs_password_change: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "partner" | "client" | "logistics" | "financial"
      machine_status:
        | "ACTIVE"
        | "INACTIVE"
        | "MAINTENANCE"
        | "BLOCKED"
        | "STOCK"
        | "TRANSIT"
      notification_type:
        | "PAYMENT"
        | "BALANCE"
        | "MACHINE"
        | "COMMISSION"
        | "SYSTEM"
        | "GENERAL"
        | "SALE"
        | "SUPPORT"
        | "LOGISTICS"
      payment_method: "CREDIT" | "DEBIT" | "PIX"
      payment_request_status: "PENDING" | "APPROVED" | "PAID" | "REJECTED"
      payment_status: "PENDING" | "APPROVED" | "REJECTED"
      pix_key_type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM"
      processing_status: "RAW" | "PROCESSED"
      support_request_priority: "LOW" | "MEDIUM" | "HIGH"
      support_request_status:
        | "PENDING"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELED"
      support_request_type:
        | "INSTALLATION"
        | "MAINTENANCE"
        | "REPLACEMENT"
        | "SUPPLIES"
        | "REMOVAL"
        | "OTHER"
      user_role: "ADMIN" | "FINANCIAL" | "PARTNER" | "LOGISTICS" | "CLIENT"
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
      app_role: ["admin", "partner", "client", "logistics", "financial"],
      machine_status: [
        "ACTIVE",
        "INACTIVE",
        "MAINTENANCE",
        "BLOCKED",
        "STOCK",
        "TRANSIT",
      ],
      notification_type: [
        "PAYMENT",
        "BALANCE",
        "MACHINE",
        "COMMISSION",
        "SYSTEM",
        "GENERAL",
        "SALE",
        "SUPPORT",
        "LOGISTICS",
      ],
      payment_method: ["CREDIT", "DEBIT", "PIX"],
      payment_request_status: ["PENDING", "APPROVED", "PAID", "REJECTED"],
      payment_status: ["PENDING", "APPROVED", "REJECTED"],
      pix_key_type: ["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"],
      processing_status: ["RAW", "PROCESSED"],
      support_request_priority: ["LOW", "MEDIUM", "HIGH"],
      support_request_status: [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELED",
      ],
      support_request_type: [
        "INSTALLATION",
        "MAINTENANCE",
        "REPLACEMENT",
        "SUPPLIES",
        "REMOVAL",
        "OTHER",
      ],
      user_role: ["ADMIN", "FINANCIAL", "PARTNER", "LOGISTICS", "CLIENT"],
    },
  },
} as const
