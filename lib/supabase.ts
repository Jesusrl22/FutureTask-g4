import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          country: string
          timezone: string
          joined_at: string
          last_active: string
          is_premium: boolean
          subscription_type: "free" | "monthly" | "yearly"
          notification_settings: any
          theme: string
        }
        Insert: {
          id: string
          email: string
          name: string
          country?: string
          timezone?: string
          joined_at?: string
          last_active?: string
          is_premium?: boolean
          subscription_type?: "free" | "monthly" | "yearly"
          notification_settings?: any
          theme?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          country?: string
          timezone?: string
          joined_at?: string
          last_active?: string
          is_premium?: boolean
          subscription_type?: "free" | "monthly" | "yearly"
          notification_settings?: any
          theme?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          date: string
          priority: "low" | "medium" | "high"
          category: string
          notes: string | null
          completed_at: string | null
          reminder_time: string | null
          notified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          date: string
          priority?: "low" | "medium" | "high"
          category?: string
          notes?: string | null
          completed_at?: string | null
          reminder_time?: string | null
          notified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          date?: string
          priority?: "low" | "medium" | "high"
          category?: string
          notes?: string | null
          completed_at?: string | null
          reminder_time?: string | null
          notified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          unlocked: boolean
          unlocked_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "task" | "achievement" | "reminder" | "streak"
          timestamp: string
          read: boolean
          task_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: "task" | "achievement" | "reminder" | "streak"
          timestamp?: string
          read?: boolean
          task_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: "task" | "achievement" | "reminder" | "streak"
          timestamp?: string
          read?: boolean
          task_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
