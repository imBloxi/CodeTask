import { createClient } from './server'
import { type Tables } from '@/types/supabase'

export async function getProfile() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return profile
}

export async function getWorkspaces() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return []
  }

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select(`
      *,
      workspace_members!inner(*)
    `)
    .eq('workspace_members.user_id', session.user.id)

  return workspaces || []
}

export async function getWorkspace(slug: string) {
  const supabase = createClient()
  
  const { data: workspace } = await supabase
    .from('workspaces')
    .select(`
      *,
      workspace_members(
        *,
        profile:profiles(*)
      )
    `)
    .eq('slug', slug)
    .single()

  return workspace
}

export async function getTasks(workspaceId: string) {
  const supabase = createClient()
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!assigned_to(*),
      creator:profiles!created_by(*),
      comments:task_comments(
        *,
        user:profiles(*)
      ),
      attachments:task_attachments(*),
      labels:task_labels(*)
    `)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  return tasks || []
}

export async function createTask(workspaceId: string, task: Partial<Tables['tasks']>) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert({
      ...task,
      workspace_id: workspaceId,
      created_by: session.user.id
    })
    .select(`
      *,
      assignee:profiles!assigned_to(*),
      creator:profiles!created_by(*),
      comments:task_comments(
        *,
        user:profiles(*)
      ),
      attachments:task_attachments(*),
      labels:task_labels(*)
    `)
    .single()

  if (error) {
    throw error
  }

  return newTask
}

export async function updateTask(taskId: string, updates: Partial<Tables['tasks']>) {
  const supabase = createClient()
  
  const { data: updatedTask, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select(`
      *,
      assignee:profiles!assigned_to(*),
      creator:profiles!created_by(*),
      comments:task_comments(
        *,
        user:profiles(*)
      ),
      attachments:task_attachments(*),
      labels:task_labels(*)
    `)
    .single()

  if (error) {
    throw error
  }

  return updatedTask
}

export async function createWorkspace(workspace: Pick<Tables['workspaces'], 'name' | 'slug'>) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const { data: newWorkspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert(workspace)
    .select()
    .single()

  if (workspaceError) {
    throw workspaceError
  }

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: newWorkspace.id,
      user_id: session.user.id,
      role: 'admin'
    })

  if (memberError) {
    throw memberError
  }

  return newWorkspace
} 