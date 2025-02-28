'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useSupabase } from '@/hooks/use-supabase'

const Context = createContext<ReturnType<typeof useSupabase> | undefined>(
  undefined
)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabase()

  return <Context.Provider value={supabase}>{children}</Context.Provider>
}

export function useSupabaseContext() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider')
  }
  return context
} 