'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { type Task } from '@/types/supabase'
import { getClientTasks } from '@/lib/supabase/client-queries'
import { useRealtime } from './use-realtime'
import { useWorkspace } from './use-workspace'

interface TasksContextType {
  tasks: Task[]
  isLoading: boolean
  error: Error | null
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { workspace } = useWorkspace()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTasks() {
      if (!workspace) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getClientTasks(workspace.id)
        setTasks(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [workspace])

  useRealtime<Task>('tasks', {
    callback: (payload) => {
      if (!workspace || !('workspace_id' in payload.new)) return
      if (payload.new.workspace_id !== workspace.id) return

      switch (payload.eventType) {
        case 'INSERT':
          setTasks((prev) => [payload.new as Task, ...prev])
          break
        case 'UPDATE':
          setTasks((prev) =>
            prev.map((task) =>
              task.id === payload.new.id ? (payload.new as Task) : task
            )
          )
          break
        case 'DELETE':
          setTasks((prev) => prev.filter((task) => task.id !== payload.old.id))
          break
      }
    }
  })

  return (
    <TasksContext.Provider value={{ tasks, isLoading, error }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
} 