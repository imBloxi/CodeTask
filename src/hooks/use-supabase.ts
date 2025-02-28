import { createClient } from '@/lib/supabase/config'
import { useEffect, useState } from 'react'
import { type SupabaseClient } from '@supabase/supabase-js'

export function useSupabase() {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { supabase, user, loading }
} 