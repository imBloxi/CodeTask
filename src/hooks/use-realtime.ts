import { useEffect } from 'react'
import { useSupabaseContext } from '@/components/providers/supabase-provider'
import { type RealtimeChannel, type RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeOptions<T extends Record<string, any>> {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
}

export function useRealtime<T extends Record<string, any>>(
  table: string,
  options: UseRealtimeOptions<T>
) {
  const { supabase } = useSupabaseContext()
  const { event = '*', callback } = options

  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = async () => {
      channel = supabase
        .channel('realtime')
        .on<T>(
          'postgres_changes' as any,
          {
            event,
            schema: 'public',
            table
          },
          callback
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, table, event, callback])
} 