export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          desc_full: string | null
          desc_short: string | null
          icon: string | null
          id: string
          name: string
          school: string
        }
        Insert: {
          desc_full?: string | null
          desc_short?: string | null
          icon?: string | null
          id?: string
          name: string
          school: string
        }
        Update: {
          desc_full?: string | null
          desc_short?: string | null
          icon?: string | null
          id?: string
          name?: string
          school?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_school_fkey"
            columns: ["school"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      announcements: {
        Row: {
          author: string
          class_id: string | null
          clone_id: string | null
          content: Json | null
          id: string
          parent: string | null
          time: string | null
          title: string | null
          type: number
        }
        Insert: {
          author: string
          class_id?: string | null
          clone_id?: string | null
          content?: Json | null
          id?: string
          parent?: string | null
          time?: string | null
          title?: string | null
          type?: number
        }
        Update: {
          author?: string
          class_id?: string | null
          clone_id?: string | null
          content?: Json | null
          id?: string
          parent?: string | null
          time?: string | null
          title?: string | null
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_parent_fkey"
            columns: ["parent"]
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          }
        ]
      }
      assignments: {
        Row: {
          class_id: string
          content: Json | null
          created_date: string | null
          description: string
          due_date: string | null
          due_type: number | null
          group_id: string | null
          hidden: boolean
          id: string
          max_grade: number | null
          name: string
          publish_date: string | null
          publish_type: number | null
          settings: Json | null
          submission_instructions: string | null
          term: string | null
          type: number
        }
        Insert: {
          class_id: string
          content?: Json | null
          created_date?: string | null
          description: string
          due_date?: string | null
          due_type?: number | null
          group_id?: string | null
          hidden?: boolean
          id?: string
          max_grade?: number | null
          name: string
          publish_date?: string | null
          publish_type?: number | null
          settings?: Json | null
          submission_instructions?: string | null
          term?: string | null
          type?: number
        }
        Update: {
          class_id?: string
          content?: Json | null
          created_date?: string | null
          description?: string
          due_date?: string | null
          due_type?: number | null
          group_id?: string | null
          hidden?: boolean
          id?: string
          max_grade?: number | null
          name?: string
          publish_date?: string | null
          publish_type?: number | null
          settings?: Json | null
          submission_instructions?: string | null
          term?: string | null
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          }
        ]
      }
      class_users: {
        Row: {
          class_id: string
          grade: number | null
          grades: Json[] | null
          teacher: boolean
          user_id: string
        }
        Insert: {
          class_id: string
          grade?: number | null
          grades?: Json[] | null
          teacher?: boolean
          user_id: string
        }
        Update: {
          class_id?: string
          grade?: number | null
          grades?: Json[] | null
          teacher?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_users_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      classes: {
        Row: {
          block: number
          classpills: Json[]
          color: string
          description: string
          full_description: Json | null
          id: string
          image: string | null
          name: string
          name_full: string | null
          room: string | null
          schedule_type: number
          school: string
          tags: string[] | null
          type: number
        }
        Insert: {
          block?: number
          classpills?: Json[]
          color?: string
          description?: string
          full_description?: Json | null
          id?: string
          image?: string | null
          name: string
          name_full?: string | null
          room?: string | null
          schedule_type?: number
          school: string
          tags?: string[] | null
          type: number
        }
        Update: {
          block?: number
          classpills?: Json[]
          color?: string
          description?: string
          full_description?: Json | null
          id?: string
          image?: string | null
          name?: string
          name_full?: string | null
          room?: string | null
          schedule_type?: number
          school?: string
          tags?: string[] | null
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_fkey"
            columns: ["school"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      days_schedule: {
        Row: {
          date: string
          schedule_items: Json | null
          template: number | null
        }
        Insert: {
          date: string
          schedule_items?: Json | null
          template?: number | null
        }
        Update: {
          date?: string
          schedule_items?: Json | null
          template?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "days_schedule_template_fkey"
            columns: ["template"]
            referencedRelation: "schedule_templates"
            referencedColumns: ["id"]
          }
        ]
      }
      enrolled: {
        Row: {
          admin_bool: boolean
          school_id: string
          user_id: string
        }
        Insert: {
          admin_bool?: boolean
          school_id: string
          user_id: string
        }
        Update: {
          admin_bool?: boolean
          school_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrolled_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrolled_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      relationships: {
        Row: {
          parent_id: string[] | null
          student_id: string[] | null
          user_id: string
        }
        Insert: {
          parent_id?: string[] | null
          student_id?: string[] | null
          user_id: string
        }
        Update: {
          parent_id?: string[] | null
          student_id?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationships_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule_templates: {
        Row: {
          id: number
          name: string | null
          schedule_items: Json | null
        }
        Insert: {
          id?: number
          name?: string | null
          schedule_items?: Json | null
        }
        Update: {
          id?: number
          name?: string | null
          schedule_items?: Json | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          created_at: string | null
          id: string
          name: string
          schedule: Json[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          schedule?: Json[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          schedule?: Json[] | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          settings: Json
          user_id: string
        }
        Insert: {
          settings: Json
          user_id: string
        }
        Update: {
          settings?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      starred: {
        Row: {
          assignment_id: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "starred_assignment_id_fkey"
            columns: ["assignment_id"]
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starred_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      submissions: {
        Row: {
          assignment_id: string
          content: Json | null
          created_at: string
          final: boolean
          grade: number | null
          graded_on: string | null
          hide: boolean | null
          id: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          content?: Json | null
          created_at?: string
          final: boolean
          grade?: number | null
          graded_on?: string | null
          hide?: boolean | null
          id?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          content?: Json | null
          created_at?: string
          final?: boolean
          grade?: number | null
          graded_on?: string | null
          hide?: boolean | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          date_earned: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          date_earned?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          date_earned?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string
          bio: string | null
          created: string
          email: string
          full_name: string
          id: string
          onboarded: boolean
          phone_number: string | null
          preferred_name: string | null
          student_id: string | null
          year: string | null
        }
        Insert: {
          avatar_url: string
          bio?: string | null
          created?: string
          email: string
          full_name: string
          id: string
          onboarded?: boolean
          phone_number?: string | null
          preferred_name?: string | null
          student_id?: string | null
          year?: string | null
        }
        Update: {
          avatar_url?: string
          bio?: string | null
          created?: string
          email?: string
          full_name?: string
          id?: string
          onboarded?: boolean
          phone_number?: string | null
          preferred_name?: string | null
          student_id?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      weights: {
        Row: {
          id: string
          name: string
          weight: number | null
        }
        Insert: {
          id?: string
          name: string
          weight?: number | null
        }
        Update: {
          id?: string
          name?: string
          weight?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_announcement: {
        Args: {
          title: string
          content: string
          group_id: string
        }
        Returns: boolean
      }
      get_profile_classes: {
        Args: {
          id: string
        }
        Returns: {
          block: number
          classpills: Json[]
          color: string
          description: string
          full_description: Json | null
          id: string
          image: string | null
          name: string
          name_full: string | null
          room: string | null
          schedule_type: number
          school: string
          tags: string[] | null
          type: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
