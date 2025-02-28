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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          code_snippet: string | null
          language: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'archived'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          code_snippet?: string | null
          language?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'archived'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          code_snippet?: string | null
          language?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'archived'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type UserRole = 'admin' | 'member'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  billing_address: any | null
  payment_method: any | null
  email: string
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  workspace_id: string
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
  // Joined fields
  profile?: Profile
  workspace?: Workspace
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  workspace_id: string
  assigned_to: string | null
  created_by: string
  created_at: string
  updated_at: string
  // Joined fields
  assignee?: Profile
  creator?: Profile
  workspace?: Workspace
  comments?: TaskComment[]
  attachments?: TaskAttachment[]
  labels?: TaskLabel[]
}

export interface TaskComment {
  id: string
  content: string
  task_id: string
  user_id: string
  created_at: string
  updated_at: string
  // Joined fields
  user?: Profile
  task?: Task
}

export interface TaskAttachment {
  id: string
  name: string
  file_url: string
  file_type: string
  file_size: number
  task_id: string
  uploaded_by: string
  created_at: string
  // Joined fields
  uploader?: Profile
  task?: Task
}

export interface TaskLabel {
  id: string
  name: string
  color: string
  workspace_id: string
  created_at: string
  updated_at: string
  // Joined fields
  workspace?: Workspace
}

export interface TaskLabelAssignment {
  task_id: string
  label_id: string
  created_at: string
  // Joined fields
  task?: Task
  label?: TaskLabel
}

export type Tables = {
  profiles: Profile
  workspaces: Workspace
  workspace_members: WorkspaceMember
  tasks: Task
  task_comments: TaskComment
  task_attachments: TaskAttachment
  task_labels: TaskLabel
  task_label_assignments: TaskLabelAssignment
} 