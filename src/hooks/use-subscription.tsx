'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useWorkspace } from './use-workspace'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Subscription {
  id: string
  status: string
  price_id: string
  quantity: number
  cancel_at_period_end: boolean
  current_period_start: string
  current_period_end: string
  ended_at: string | null
  cancel_at: string | null
  canceled_at: string | null
  trial_start: string | null
  trial_end: string | null
  stripe_subscription_id: string
}

interface SubscriptionContextType {
  subscription: Subscription | null
  isLoading: boolean
  error: Error | null
  createCheckoutSession: (priceId: string) => Promise<{ url: string | null }>
  createPortalSession: () => Promise<{ url: string | null }>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { workspace } = useWorkspace()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!workspace?.id) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    async function loadSubscription() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('workspace_id', workspace.id)
          .single()

        if (error) throw error

        setSubscription(data)
      } catch (error: any) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscription()
  }, [workspace, supabase])

  useEffect(() => {
    if (!workspace?.id) return

    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `workspace_id=eq.${workspace.id}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setSubscription(null)
          } else {
            setSubscription(payload.new as Subscription)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspace, supabase])

  const createCheckoutSession = async (priceId: string) => {
    try {
      if (!workspace?.id) throw new Error('No workspace selected')

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          workspaceId: workspace.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      return data
    } catch (error: any) {
      setError(error)
      return { url: null }
    }
  }

  const createPortalSession = async () => {
    try {
      if (!workspace?.id) throw new Error('No workspace selected')

      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      return data
    } catch (error: any) {
      setError(error)
      return { url: null }
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        createCheckoutSession,
        createPortalSession,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
} 