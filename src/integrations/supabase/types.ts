export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
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
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
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
          risk_score: number | null
          user_agent: string | null
          user_id: string
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
          risk_score?: number | null
          user_agent?: string | null
          user_id: string
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
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_spending_insights: {
        Args: { user_id_param: string; period_days?: number }
        Returns: {
          category: string
          total_amount: number
          transaction_count: number
          avg_transaction: number
          period_start: string
          period_end: string
        }[]
      }
      create_child_account: {
        Args: {
          p_parent_id: string
          p_child_email: string
          p_first_name: string
          p_last_name: string
          p_relationship_type: string
          p_spending_limit?: number
          p_transaction_limit?: number
        }
        Returns: Json
      }
      create_travel_booking: {
        Args: {
          p_user_id: string
          p_destination_id: string
          p_account_id: string
          p_booking_type: string
          p_total_amount: number
          p_departure_date: string
          p_return_date?: string
          p_travelers_count?: number
        }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_event_description: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_device_fingerprint?: string
          p_location?: string
          p_risk_score?: number
          p_blocked?: boolean
        }
        Returns: string
      }
      send_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_category?: string
          p_data?: Json
          p_action_url?: string
          p_expires_hours?: number
        }
        Returns: string
      }
      transfer_between_accounts: {
        Args: {
          p_from_account_id: string
          p_to_account_id: string
          p_amount: number
          p_description?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
