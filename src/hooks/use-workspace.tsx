'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter as useNextRouter } from 'next/navigation'
import { type Workspace } from '@/types/supabase'
import { getClientWorkspaces, createClientWorkspace } from '@/lib/supabase/client-queries'
import { useRealtime } from './use-realtime'

interface WorkspaceContextType {
  workspaces: Workspace[]
  workspace: Workspace | null
  isLoading: boolean
  error: Error | null
  createWorkspace: (name: string) => Promise<void>
  selectWorkspace: (workspace: Workspace) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useNextRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getClientWorkspaces()
        setWorkspaces(data || [])
        if (data && data.length > 0 && !workspace) {
          setWorkspace(data[0])
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkspaces()
  }, [workspace])

  useRealtime<Workspace>('workspaces', {
    callback: (payload) => {
      switch (payload.eventType) {
        case 'INSERT':
          setWorkspaces((prev) => [...prev, payload.new as Workspace])
          break
        case 'UPDATE':
          setWorkspaces((prev) =>
            prev.map((w) =>
              w.id === payload.new.id ? (payload.new as Workspace) : w
            )
          )
          if (workspace?.id === payload.new.id) {
            setWorkspace(payload.new as Workspace)
          }
          break
        case 'DELETE':
          setWorkspaces((prev) => prev.filter((w) => w.id !== payload.old.id))
          if (workspace?.id === payload.old.id) {
            setWorkspace(null)
          }
          break
      }
    }
  })

  const createWorkspace = async (name: string) => {
    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-')
      const newWorkspace = await createClientWorkspace({ name, slug })
      setWorkspace(newWorkspace)
      router.push(`/dashboard/${newWorkspace.slug}`)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const selectWorkspace = (workspace: Workspace) => {
    setWorkspace(workspace)
    router.push(`/dashboard/${workspace.slug}`)
  }

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        workspace,
        isLoading,
        error,
        createWorkspace,
        selectWorkspace
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
} 