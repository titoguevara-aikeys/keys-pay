export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      access_control_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          reason: string | null
          resource: string
          success: boolean
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          reason?: string | null
          resource: string
          success: boolean
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          reason?: string | null
          resource?: string
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          account_number: string
          account_type: string
          balance: number
          created_at: string
          currency: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number: string
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_audit: {
        Row: {
          action: string
          created_at: string
          id: number
          meta: Json | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: number
          meta?: Json | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: number
          meta?: Json | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          action_items: Json | null
          confidence_score: number
          created_at: string
          data: Json
          description: string
          expires_at: string | null
          id: string
          insight_type: string
          is_dismissed: boolean | null
          is_read: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_items?: Json | null
          confidence_score?: number
          created_at?: string
          data?: Json
          description: string
          expires_at?: string | null
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_items?: Json | null
          confidence_score?: number
          created_at?: string
          data?: Json
          description?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      allowances: {
        Row: {
          amount: number
          child_id: string
          conditions: Json | null
          created_at: string
          frequency: string
          id: string
          is_active: boolean | null
          name: string
          next_payment_date: string
          parent_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          child_id: string
          conditions?: Json | null
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          name: string
          next_payment_date: string
          parent_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          child_id?: string
          conditions?: Json | null
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          name?: string
          next_payment_date?: string
          parent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      anonymous_access_log: {
        Row: {
          access_count: number
          blocked_until: string | null
          first_access: string
          id: string
          ip_address: unknown | null
          last_access: string
          table_name: string
        }
        Insert: {
          access_count?: number
          blocked_until?: string | null
          first_access?: string
          id?: string
          ip_address?: unknown | null
          last_access?: string
          table_name: string
        }
        Update: {
          access_count?: number
          blocked_until?: string | null
          first_access?: string
          id?: string
          ip_address?: unknown | null
          last_access?: string
          table_name?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          actor_email: string | null
          actor_id: string
          created_at: string
          details: Json
          event_type: string
          id: string
          ip_address: unknown | null
          timestamp: string
        }
        Insert: {
          actor_email?: string | null
          actor_id: string
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          timestamp?: string
        }
        Update: {
          actor_email?: string | null
          actor_id?: string
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          timestamp?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          account_id: string | null
          amount: number | null
          category: string | null
          created_at: string
          currency: string | null
          due_date: string | null
          id: string
          is_recurring: boolean | null
          payee_account: string
          payee_name: string
          recurring_frequency: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          payee_account: string
          payee_name: string
          recurring_frequency?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          payee_account?: string
          payee_name?: string
          recurring_frequency?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      biometric_credentials: {
        Row: {
          counter: number | null
          created_at: string
          credential_id: string
          credential_type: string | null
          id: string
          last_used: string | null
          name: string | null
          public_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          counter?: number | null
          created_at?: string
          credential_id: string
          credential_type?: string | null
          id?: string
          last_used?: string | null
          name?: string | null
          public_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          counter?: number | null
          created_at?: string
          credential_id?: string
          credential_type?: string | null
          id?: string
          last_used?: string | null
          name?: string | null
          public_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_details: Json | null
          booking_ref: string | null
          commission_amount: number | null
          commission_currency: string | null
          created_at: string | null
          currency: string | null
          deal_id: string | null
          guest_info: Json | null
          id: string
          member_discount: number | null
          partner_booking_ref: string | null
          partner_id: string | null
          payment_method: string | null
          status: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_details?: Json | null
          booking_ref?: string | null
          commission_amount?: number | null
          commission_currency?: string | null
          created_at?: string | null
          currency?: string | null
          deal_id?: string | null
          guest_info?: Json | null
          id?: string
          member_discount?: number | null
          partner_booking_ref?: string | null
          partner_id?: string | null
          payment_method?: string | null
          status?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_details?: Json | null
          booking_ref?: string | null
          commission_amount?: number | null
          commission_currency?: string | null
          created_at?: string | null
          currency?: string | null
          deal_id?: string | null
          guest_info?: Json | null
          id?: string
          member_discount?: number | null
          partner_booking_ref?: string | null
          partner_id?: string | null
          payment_method?: string | null
          status?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          alert_threshold: number | null
          amount: number
          category: string
          created_at: string
          end_date: string | null
          id: string
          name: string
          period: string
          start_date: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_threshold?: number | null
          amount: number
          category: string
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          period?: string
          start_date: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_threshold?: number | null
          amount?: number
          category?: string
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          period?: string
          start_date?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          account_id: string
          card_number: string
          card_status: string
          card_type: string
          created_at: string
          id: string
          spending_limit: number | null
          updated_at: string
        }
        Insert: {
          account_id: string
          card_number: string
          card_status?: string
          card_type?: string
          created_at?: string
          id?: string
          spending_limit?: number | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          card_number?: string
          card_status?: string
          card_type?: string
          created_at?: string
          id?: string
          spending_limit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      child_savings_goals: {
        Row: {
          category: string | null
          child_id: string
          completed_at: string | null
          created_at: string
          current_amount: number | null
          goal_name: string
          id: string
          image_url: string | null
          parent_id: string
          reward_description: string | null
          status: string | null
          target_amount: number
          target_date: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          child_id: string
          completed_at?: string | null
          created_at?: string
          current_amount?: number | null
          goal_name: string
          id?: string
          image_url?: string | null
          parent_id: string
          reward_description?: string | null
          status?: string | null
          target_amount: number
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          child_id?: string
          completed_at?: string | null
          created_at?: string
          current_amount?: number | null
          goal_name?: string
          id?: string
          image_url?: string | null
          parent_id?: string
          reward_description?: string | null
          status?: string | null
          target_amount?: number
          target_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      child_spending_controls: {
        Row: {
          category: string
          child_id: string
          created_at: string
          daily_limit: number | null
          id: string
          is_allowed: boolean | null
          location_restrictions: Json | null
          monthly_limit: number | null
          parent_id: string
          time_restrictions: Json | null
          updated_at: string
          weekly_limit: number | null
        }
        Insert: {
          category: string
          child_id: string
          created_at?: string
          daily_limit?: number | null
          id?: string
          is_allowed?: boolean | null
          location_restrictions?: Json | null
          monthly_limit?: number | null
          parent_id: string
          time_restrictions?: Json | null
          updated_at?: string
          weekly_limit?: number | null
        }
        Update: {
          category?: string
          child_id?: string
          created_at?: string
          daily_limit?: number | null
          id?: string
          is_allowed?: boolean | null
          location_restrictions?: Json | null
          monthly_limit?: number | null
          parent_id?: string
          time_restrictions?: Json | null
          updated_at?: string
          weekly_limit?: number | null
        }
        Relationships: []
      }
      chores: {
        Row: {
          approved_at: string | null
          category: string | null
          child_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_recurring: boolean | null
          parent_id: string
          priority: string | null
          recurrence_pattern: string | null
          reward_amount: number | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          category?: string | null
          child_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          parent_id: string
          priority?: string | null
          recurrence_pattern?: string | null
          reward_amount?: number | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          category?: string | null
          child_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          parent_id?: string
          priority?: string | null
          recurrence_pattern?: string | null
          reward_amount?: number | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      circle_health_metrics: {
        Row: {
          circuit_breaker_state: string | null
          created_at: string
          endpoint: string
          error_count: number | null
          id: string
          response_time_ms: number
          status_code: number | null
          success_count: number | null
          timestamp: string
        }
        Insert: {
          circuit_breaker_state?: string | null
          created_at?: string
          endpoint: string
          error_count?: number | null
          id?: string
          response_time_ms: number
          status_code?: number | null
          success_count?: number | null
          timestamp?: string
        }
        Update: {
          circuit_breaker_state?: string | null
          created_at?: string
          endpoint?: string
          error_count?: number | null
          id?: string
          response_time_ms?: number
          status_code?: number | null
          success_count?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      circle_transactions: {
        Row: {
          amount: number
          circle_response: Json | null
          circle_transaction_id: string | null
          circle_wallet_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          deposit_address: string | null
          destination_address: string | null
          error_details: Json | null
          id: string
          idempotency_key: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
          webhook_received_at: string | null
        }
        Insert: {
          amount: number
          circle_response?: Json | null
          circle_transaction_id?: string | null
          circle_wallet_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          deposit_address?: string | null
          destination_address?: string | null
          error_details?: Json | null
          id?: string
          idempotency_key?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
          webhook_received_at?: string | null
        }
        Update: {
          amount?: number
          circle_response?: Json | null
          circle_transaction_id?: string | null
          circle_wallet_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          deposit_address?: string | null
          destination_address?: string | null
          error_details?: Json | null
          id?: string
          idempotency_key?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
          webhook_received_at?: string | null
        }
        Relationships: []
      }
      circle_webhooks: {
        Row: {
          created_at: string
          event_type: string
          id: string
          processed_at: string
          raw_payload: string | null
          signature: string
          webhook_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          processed_at?: string
          raw_payload?: string | null
          signature: string
          webhook_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          processed_at?: string
          raw_payload?: string | null
          signature?: string
          webhook_id?: string
        }
        Relationships: []
      }
      commission_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      crypto_assets: {
        Row: {
          created_at: string
          current_price: number
          icon_url: string | null
          id: string
          is_active: boolean
          market_cap: number | null
          name: string
          price_change_24h: number | null
          symbol: string
          updated_at: string
          volume_24h: number | null
        }
        Insert: {
          created_at?: string
          current_price?: number
          icon_url?: string | null
          id?: string
          is_active?: boolean
          market_cap?: number | null
          name: string
          price_change_24h?: number | null
          symbol: string
          updated_at?: string
          volume_24h?: number | null
        }
        Update: {
          created_at?: string
          current_price?: number
          icon_url?: string | null
          id?: string
          is_active?: boolean
          market_cap?: number | null
          name?: string
          price_change_24h?: number | null
          symbol?: string
          updated_at?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      crypto_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          fee: number | null
          from_address: string | null
          id: string
          status: string
          to_address: string | null
          transaction_hash: string | null
          transaction_type: string
          usd_value: number | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          fee?: number | null
          from_address?: string | null
          id?: string
          status?: string
          to_address?: string | null
          transaction_hash?: string | null
          transaction_type: string
          usd_value?: number | null
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          fee?: number | null
          from_address?: string | null
          id?: string
          status?: string
          to_address?: string | null
          transaction_hash?: string | null
          transaction_type?: string
          usd_value?: number | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crypto_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "crypto_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_wallets: {
        Row: {
          asset_id: string
          balance: number
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          asset_id: string
          balance?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          asset_id?: string
          balance?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_wallets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "crypto_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          destination: string | null
          external_id: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          last_seen: string | null
          member_price: number | null
          partner_id: string | null
          public_price: number
          tags: string[] | null
          title: string
          url: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination?: string | null
          external_id: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          last_seen?: string | null
          member_price?: number | null
          partner_id?: string | null
          public_price: number
          tags?: string[] | null
          title: string
          url?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination?: string | null
          external_id?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          last_seen?: string | null
          member_price?: number | null
          partner_id?: string | null
          public_price?: number
          tags?: string[] | null
          title?: string
          url?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      device_trust: {
        Row: {
          created_at: string
          device_fingerprint: string
          device_name: string | null
          expires_at: string | null
          id: string
          last_seen: string | null
          metadata: Json | null
          trust_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          device_name?: string | null
          expires_at?: string | null
          id?: string
          last_seen?: string | null
          metadata?: Json | null
          trust_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          device_name?: string | null
          expires_at?: string | null
          id?: string
          last_seen?: string | null
          metadata?: Json | null
          trust_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      family_activities: {
        Row: {
          activity_type: string
          amount: number | null
          child_id: string
          created_at: string
          description: string | null
          family_control_id: string
          id: string
          metadata: Json | null
          parent_id: string
          title: string
        }
        Insert: {
          activity_type: string
          amount?: number | null
          child_id: string
          created_at?: string
          description?: string | null
          family_control_id: string
          id?: string
          metadata?: Json | null
          parent_id: string
          title: string
        }
        Update: {
          activity_type?: string
          amount?: number | null
          child_id?: string
          created_at?: string
          description?: string | null
          family_control_id?: string
          id?: string
          metadata?: Json | null
          parent_id?: string
          title?: string
        }
        Relationships: []
      }
      family_controls: {
        Row: {
          child_id: string
          created_at: string
          id: string
          parent_id: string
          relationship_type: string
          spending_limit: number | null
          status: string
          transaction_limit: number | null
          updated_at: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          parent_id: string
          relationship_type?: string
          spending_limit?: number | null
          status?: string
          transaction_limit?: number | null
          updated_at?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          parent_id?: string
          relationship_type?: string
          spending_limit?: number | null
          status?: string
          transaction_limit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_controls_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      financial_education: {
        Row: {
          child_id: string
          completed_at: string | null
          created_at: string
          id: string
          module_name: string
          module_type: string
          progress: number | null
          score: number | null
          updated_at: string
        }
        Insert: {
          child_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          module_name: string
          module_type: string
          progress?: number | null
          score?: number | null
          updated_at?: string
        }
        Update: {
          child_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          module_name?: string
          module_type?: string
          progress?: number | null
          score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      financial_health_scores: {
        Row: {
          created_at: string
          debt_score: number
          factors: Json
          id: string
          investment_score: number
          overall_score: number
          period_end: string
          period_start: string
          recommendations: Json | null
          saving_score: number
          spending_score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          debt_score: number
          factors?: Json
          id?: string
          investment_score: number
          overall_score: number
          period_end: string
          period_start: string
          recommendations?: Json | null
          saving_score: number
          spending_score: number
          user_id: string
        }
        Update: {
          created_at?: string
          debt_score?: number
          factors?: Json
          id?: string
          investment_score?: number
          overall_score?: number
          period_end?: string
          period_start?: string
          recommendations?: Json | null
          saving_score?: number
          spending_score?: number
          user_id?: string
        }
        Relationships: []
      }
      fraud_rules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          risk_score: number | null
          rule_config: Json
          rule_name: string
          rule_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          risk_score?: number | null
          rule_config: Json
          rule_name: string
          rule_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          risk_score?: number | null
          rule_config?: Json
          rule_name?: string
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      idempotency_keys: {
        Row: {
          created_at: string | null
          key: string
          payload_hash: string | null
          provider: string
          response_status: number | null
        }
        Insert: {
          created_at?: string | null
          key: string
          payload_hash?: string | null
          provider: string
          response_status?: number | null
        }
        Update: {
          created_at?: string | null
          key?: string
          payload_hash?: string | null
          provider?: string
          response_status?: number | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          attempts: number | null
          created_at: string | null
          error_message: string | null
          id: string
          last_run: string | null
          max_attempts: number | null
          next_run: string | null
          partner_id: string | null
          payload: Json | null
          result: Json | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_run?: string | null
          max_attempts?: number | null
          next_run?: string | null
          partner_id?: string | null
          payload?: Json | null
          result?: Json | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_run?: string | null
          max_attempts?: number | null
          next_run?: string | null
          partner_id?: string | null
          payload?: Json | null
          result?: Json | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      login_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          location: string | null
          revoked_at: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          location?: string | null
          revoked_at?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          location?: string | null
          revoked_at?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          active: boolean
          created_at: string
          expires_at: string | null
          id: string
          tier: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          tier?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
      merchants: {
        Row: {
          business_address: string | null
          business_email: string
          business_name: string
          business_phone: string | null
          created_at: string
          id: string
          merchant_id: string | null
          settings: Json | null
          status: string | null
          updated_at: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          business_address?: string | null
          business_email: string
          business_name: string
          business_phone?: string | null
          created_at?: string
          id?: string
          merchant_id?: string | null
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          business_address?: string | null
          business_email?: string
          business_name?: string
          business_phone?: string | null
          created_at?: string
          id?: string
          merchant_id?: string | null
          settings?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          category?: string
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          category?: string
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      otp_rate_limits: {
        Row: {
          attempts: number
          blocked_until: string | null
          created_at: string
          email: string
          id: string
          last_attempt: string
        }
        Insert: {
          attempts?: number
          blocked_until?: string | null
          created_at?: string
          email: string
          id?: string
          last_attempt?: string
        }
        Update: {
          attempts?: number
          blocked_until?: string | null
          created_at?: string
          email?: string
          id?: string
          last_attempt?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          api_key: string | null
          api_secret: string | null
          commission_rate: number | null
          created_at: string | null
          enabled: boolean | null
          id: string
          mock_mode: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          commission_rate?: number | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          mock_mode?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          commission_rate?: number | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          mock_mode?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          event_id: string
          event_type: string
          id: string
          payment_id: string | null
          processed_at: string | null
          raw_event: Json
          status: string
          wallet_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_id: string
          event_type: string
          id?: string
          payment_id?: string | null
          processed_at?: string | null
          raw_event: Json
          status: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payment_id?: string | null
          processed_at?: string | null
          raw_event?: Json
          status?: string
          wallet_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          external_id: string
          id: string
          is_default: boolean | null
          metadata: Json | null
          provider: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          external_id: string
          id?: string
          is_default?: boolean | null
          metadata?: Json | null
          provider: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          external_id?: string
          id?: string
          is_default?: boolean | null
          metadata?: Json | null
          provider?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_queue: {
        Row: {
          attempts: number
          created_at: string
          error_details: Json | null
          id: string
          job_data: Json
          job_type: string
          max_attempts: number
          processed_at: string | null
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error_details?: Json | null
          id?: string
          job_data: Json
          job_type: string
          max_attempts?: number
          processed_at?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error_details?: Json | null
          id?: string
          job_data?: Json
          job_type?: string
          max_attempts?: number
          processed_at?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          expires_at: string | null
          from_user_id: string
          id: string
          paid_at: string | null
          status: string | null
          to_email: string | null
          to_user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          from_user_id: string
          id?: string
          paid_at?: string | null
          status?: string | null
          to_email?: string | null
          to_user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          from_user_id?: string
          id?: string
          paid_at?: string | null
          status?: string | null
          to_email?: string | null
          to_user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          booking_id: string
          created_at: string
          currency: string | null
          id: string
          provider: string
          raw: Json | null
          status: string
        }
        Insert: {
          amount?: number | null
          booking_id: string
          created_at?: string
          currency?: string | null
          id?: string
          provider: string
          raw?: Json | null
          status: string
        }
        Update: {
          amount?: number | null
          booking_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          provider?: string
          raw?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_card_orders: {
        Row: {
          card_issuance_price: number
          created_at: string
          delivery_option: string
          delivery_price: number
          estimated_delivery: string | null
          id: string
          shipping_address: Json
          status: string
          stripe_session_id: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
          virtual_card_id: string | null
        }
        Insert: {
          card_issuance_price?: number
          created_at?: string
          delivery_option: string
          delivery_price: number
          estimated_delivery?: string | null
          id?: string
          shipping_address: Json
          status?: string
          stripe_session_id?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          virtual_card_id?: string | null
        }
        Update: {
          card_issuance_price?: number
          created_at?: string
          delivery_option?: string
          delivery_price?: number
          estimated_delivery?: string | null
          id?: string
          shipping_address?: Json
          status?: string
          stripe_session_id?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          virtual_card_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "physical_card_orders_virtual_card_id_fkey"
            columns: ["virtual_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_config: {
        Row: {
          checksum: string
          config_key: string
          created_at: string | null
          encrypted_value: string
          id: string
          updated_at: string | null
        }
        Insert: {
          checksum: string
          config_key: string
          created_at?: string | null
          encrypted_value: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          checksum?: string
          config_key?: string
          created_at?: string | null
          encrypted_value?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_license: {
        Row: {
          created_at: string | null
          domain_whitelist: string[] | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          license_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain_whitelist?: string[] | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          license_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain_whitelist?: string[] | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          license_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_admin: boolean
          is_protected_owner: boolean | null
          last_name: string | null
          membership_tier: string | null
          owner_since: string | null
          phone: string | null
          platform_signature: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean
          is_protected_owner?: boolean | null
          last_name?: string | null
          membership_tier?: string | null
          owner_since?: string | null
          phone?: string | null
          platform_signature?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean
          is_protected_owner?: boolean | null
          last_name?: string | null
          membership_tier?: string | null
          owner_since?: string | null
          phone?: string | null
          platform_signature?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotion_prices: {
        Row: {
          amount: number | null
          currency: string
          member_amount: number | null
          promo_id: string
        }
        Insert: {
          amount?: number | null
          currency: string
          member_amount?: number | null
          promo_id: string
        }
        Update: {
          amount?: number | null
          currency?: string
          member_amount?: number | null
          promo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_prices_promo_id_fkey"
            columns: ["promo_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          is_member_only: boolean
          raw: Json | null
          score: number
          source: string
          starts_at: string | null
          summary: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_member_only?: boolean
          raw?: Json | null
          score?: number
          source: string
          starts_at?: string | null
          summary?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_member_only?: boolean
          raw?: Json | null
          score?: number
          source?: string
          starts_at?: string | null
          summary?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      qr_payments: {
        Row: {
          account_id: string
          amount: number | null
          created_at: string
          currency: string | null
          current_uses: number | null
          description: string | null
          expires_at: string | null
          id: string
          is_reusable: boolean | null
          max_uses: number | null
          qr_code: string
          status: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          amount?: number | null
          created_at?: string
          currency?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_reusable?: boolean | null
          max_uses?: number | null
          qr_code: string
          status?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number | null
          created_at?: string
          currency?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_reusable?: boolean | null
          max_uses?: number | null
          qr_code?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_transfers: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          end_date: string | null
          external_recipient: string | null
          frequency: string
          from_account_id: string
          id: string
          next_execution: string
          status: string | null
          to_account_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          external_recipient?: string | null
          frequency: string
          from_account_id: string
          id?: string
          next_execution: string
          status?: string | null
          to_account_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          external_recipient?: string | null
          frequency?: string
          from_account_id?: string
          id?: string
          next_execution?: string
          status?: string | null
          to_account_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_transfers_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_transfers_to_account_id_fkey"
            columns: ["to_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          blocked: boolean | null
          created_at: string
          device_fingerprint: string | null
          event_description: string
          event_type: string
          id: string
          ip_address: unknown | null
          location: string | null
          metadata: Json | null
          risk_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string
          device_fingerprint?: string | null
          event_description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          location?: string | null
          metadata?: Json | null
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          blocked?: boolean | null
          created_at?: string
          device_fingerprint?: string | null
          event_description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          location?: string | null
          metadata?: Json | null
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          biometric_enabled: boolean | null
          created_at: string
          device_verification_required: boolean | null
          fraud_monitoring_enabled: boolean | null
          id: string
          login_notifications: boolean | null
          max_concurrent_sessions: number | null
          session_timeout_minutes: number | null
          suspicious_activity_alerts: boolean | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          biometric_enabled?: boolean | null
          created_at?: string
          device_verification_required?: boolean | null
          fraud_monitoring_enabled?: boolean | null
          id?: string
          login_notifications?: boolean | null
          max_concurrent_sessions?: number | null
          session_timeout_minutes?: number | null
          suspicious_activity_alerts?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          biometric_enabled?: boolean | null
          created_at?: string
          device_verification_required?: boolean | null
          fraud_monitoring_enabled?: boolean | null
          id?: string
          login_notifications?: boolean | null
          max_concurrent_sessions?: number | null
          session_timeout_minutes?: number | null
          suspicious_activity_alerts?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_violations: {
        Row: {
          created_at: string | null
          description: string
          domain: string | null
          evidence: Json | null
          id: string
          ip_address: unknown | null
          severity: string
          status: string | null
          user_agent: string | null
          user_id: string | null
          violation_type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          domain?: string | null
          evidence?: Json | null
          id?: string
          ip_address?: unknown | null
          severity: string
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
          violation_type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          domain?: string | null
          evidence?: Json | null
          id?: string
          ip_address?: unknown | null
          severity?: string
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
          violation_type?: string
        }
        Relationships: []
      }
      spending_insights: {
        Row: {
          avg_transaction: number
          budget_id: string | null
          category: string
          created_at: string
          id: string
          period_end: string
          period_start: string
          total_amount: number
          transaction_count: number
          user_id: string
        }
        Insert: {
          avg_transaction: number
          budget_id?: string | null
          category: string
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          total_amount: number
          transaction_count: number
          user_id: string
        }
        Update: {
          avg_transaction?: number
          budget_id?: string | null
          category?: string
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          total_amount?: number
          transaction_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spending_insights_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category: string | null
          created_at: string
          description: string | null
          id: string
          recipient: string | null
          status: string
          transaction_type: string
        }
        Insert: {
          account_id: string
          amount: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recipient?: string | null
          status?: string
          transaction_type: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recipient?: string | null
          status?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_alerts: {
        Row: {
          alert_type: string
          created_at: string
          destination_id: string | null
          id: string
          message: string
          read: boolean | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          destination_id?: string | null
          id?: string
          message: string
          read?: boolean | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          destination_id?: string | null
          id?: string
          message?: string
          read?: boolean | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      travel_bookings: {
        Row: {
          account_id: string
          booking_date: string
          booking_reference: string | null
          booking_type: string
          created_at: string
          currency: string
          departure_date: string
          destination_id: string
          id: string
          metadata: Json | null
          payment_status: string
          return_date: string | null
          status: string
          total_amount: number
          travelers_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          booking_date: string
          booking_reference?: string | null
          booking_type: string
          created_at?: string
          currency?: string
          departure_date: string
          destination_id: string
          id?: string
          metadata?: Json | null
          payment_status?: string
          return_date?: string | null
          status?: string
          total_amount: number
          travelers_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          booking_date?: string
          booking_reference?: string | null
          booking_type?: string
          created_at?: string
          currency?: string
          departure_date?: string
          destination_id?: string
          id?: string
          metadata?: Json | null
          payment_status?: string
          return_date?: string | null
          status?: string
          total_amount?: number
          travelers_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_travel_bookings_destination"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "travel_destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_destinations: {
        Row: {
          average_cost_per_day: number | null
          category: string | null
          city: string
          country: string
          created_at: string
          currency: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          name: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          average_cost_per_day?: number | null
          category?: string | null
          city: string
          country: string
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          average_cost_per_day?: number | null
          category?: string | null
          city?: string
          country?: string
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      travel_documents: {
        Row: {
          country_issued: string
          created_at: string
          document_number: string
          document_type: string
          expiry_date: string | null
          id: string
          issue_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          country_issued: string
          created_at?: string
          document_number: string
          document_type: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          country_issued?: string
          created_at?: string
          document_number?: string
          document_type?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      travel_itineraries: {
        Row: {
          booking_id: string
          created_at: string
          description: string | null
          id: string
          schedule: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          description?: string | null
          id?: string
          schedule?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          description?: string | null
          id?: string
          schedule?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string
          device_fingerprint: string
          device_name: string
          device_type: string
          id: string
          is_current: boolean | null
          last_seen_at: string
          trusted_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          device_name: string
          device_type: string
          id?: string
          is_current?: boolean | null
          last_seen_at?: string
          trusted_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          device_name?: string
          device_type?: string
          id?: string
          is_current?: boolean | null
          last_seen_at?: string
          trusted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          enabled: boolean | null
          id: string
          last_used_at: string | null
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          last_used_at?: string | null
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          last_used_at?: string | null
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_keyspay_subscriber: boolean | null
          name: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_keyspay_subscriber?: boolean | null
          name?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_keyspay_subscriber?: boolean | null
          name?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wallet_ledger: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string
          id: string
          payload: Json
          processed: boolean
          provider: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          processed?: boolean
          provider: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          processed?: boolean
          provider?: string
        }
        Relationships: []
      }
      wiki_pages: {
        Row: {
          ai_summary: string | null
          extract: string | null
          fetched_at: string
          hero_image_url: string | null
          html: Json | null
          id: number
          lang: string
          sections: Json | null
          slug: string | null
          source_url: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          extract?: string | null
          fetched_at?: string
          hero_image_url?: string | null
          html?: Json | null
          id?: number
          lang?: string
          sections?: Json | null
          slug?: string | null
          source_url: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          extract?: string | null
          fetched_at?: string
          hero_image_url?: string | null
          html?: Json | null
          id?: number
          lang?: string
          sections?: Json | null
          slug?: string | null
          source_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wiki_search_cache: {
        Row: {
          fetched_at: string
          id: number
          lang: string
          query: string
          results: Json
        }
        Insert: {
          fetched_at?: string
          id?: number
          lang?: string
          query: string
          results: Json
        }
        Update: {
          fetched_at?: string
          id?: number
          lang?: string
          query?: string
          results?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_spending_insights: {
        Args: { period_days?: number; user_id_param: string }
        Returns: {
          avg_transaction: number
          category: string
          period_end: string
          period_start: string
          total_amount: number
          transaction_count: number
        }[]
      }
      check_anonymous_rate_limit: {
        Args: { p_ip_address: unknown; p_table_name: string }
        Returns: boolean
      }
      check_otp_rate_limit: {
        Args: { p_email: string }
        Returns: Json
      }
      cleanup_rate_limit_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_child_account: {
        Args: {
          p_child_email: string
          p_first_name: string
          p_last_name: string
          p_parent_id: string
          p_relationship_type: string
          p_spending_limit?: number
          p_transaction_limit?: number
        }
        Returns: Json
      }
      create_travel_booking: {
        Args: {
          p_account_id: string
          p_booking_type: string
          p_departure_date: string
          p_destination_id: string
          p_return_date?: string
          p_total_amount: number
          p_travelers_count?: number
          p_user_id: string
        }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_security_metrics: {
        Args: { p_user_id: string }
        Returns: Json
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_member: {
        Args: { u: string }
        Returns: boolean
      }
      is_protected_owner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_actor_email: string
          p_actor_id: string
          p_details?: Json
          p_event_type: string
          p_ip_address: unknown
        }
        Returns: string
      }
      log_security_event: {
        Args:
          | {
              p_blocked?: boolean
              p_device_fingerprint?: string
              p_event_description: string
              p_event_type: string
              p_ip_address?: unknown
              p_location?: string
              p_metadata?: Json
              p_risk_score?: number
              p_user_agent?: string
              p_user_id?: string
            }
          | {
              p_blocked?: boolean
              p_device_fingerprint?: string
              p_event_description: string
              p_event_type: string
              p_ip_address?: unknown
              p_location?: string
              p_risk_score?: number
              p_user_agent?: string
              p_user_id: string
            }
        Returns: string
      }
      parse_client_ip: {
        Args: { headers: Json }
        Returns: unknown
      }
      process_allowance_payment: {
        Args: { p_allowance_id: string }
        Returns: Json
      }
      send_notification: {
        Args: {
          p_action_url?: string
          p_category?: string
          p_data?: Json
          p_expires_hours?: number
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      transfer_between_accounts: {
        Args: {
          p_amount: number
          p_description?: string
          p_from_account_id: string
          p_to_account_id: string
        }
        Returns: Json
      }
      update_feature_flag: {
        Args: {
          p_actor_email?: string
          p_actor_id?: string
          p_ip_address?: unknown
          p_key: string
          p_value: Json
        }
        Returns: boolean
      }
      upsert_wiki_page: {
        Args: {
          p_ai_summary?: string
          p_extract: string
          p_fetched_at?: string
          p_hero_image_url: string
          p_html: Json
          p_lang: string
          p_sections: Json
          p_source_url: string
          p_title: string
        }
        Returns: {
          ai_summary: string | null
          extract: string | null
          fetched_at: string
          hero_image_url: string | null
          html: Json | null
          id: number
          lang: string
          sections: Json | null
          slug: string | null
          source_url: string
          title: string
          updated_at: string
        }
      }
      upsert_wiki_search_cache: {
        Args: { p_lang: string; p_query: string; p_results: Json }
        Returns: {
          fetched_at: string
          id: number
          lang: string
          query: string
          results: Json
        }
      }
      validate_platform_license: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      webhook_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "super_admin"
      app_role_enhanced:
        | "non_member"
        | "member"
        | "staff"
        | "admin"
        | "super_admin"
        | "user"
        | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "super_admin"],
      app_role_enhanced: [
        "non_member",
        "member",
        "staff",
        "admin",
        "super_admin",
        "user",
        "moderator",
      ],
    },
  },
} as const
