'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscription } from '@/hooks/use-subscription'
import { useWorkspace } from '@/hooks/use-workspace'

export function BillingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { subscription, createPortalSession } = useSubscription()
  const { workspace } = useWorkspace()
  const router = useRouter()

  const handlePortalSession = async () => {
    if (!workspace) {
      router.push('/dashboard')
      return
    }

    try {
      setIsLoading(true)
      const { url } = await createPortalSession()
      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          {subscription
            ? `You are currently on the ${subscription.status} plan.`
            : 'You are currently on the free plan.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">
              {subscription ? 'Paid Plan' : 'Free Plan'}
            </div>
            <div className="text-sm text-muted-foreground">
              {subscription
                ? `Your plan renews on ${new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()}`
                : 'Limited features'}
            </div>
          </div>
          <Button
            variant={subscription ? 'outline' : 'default'}
            onClick={subscription ? handlePortalSession : () => router.push('/pricing')}
            disabled={isLoading}
          >
            {subscription ? 'Manage Subscription' : 'Upgrade'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <p>
          Manage your subscription on Stripe. You can upgrade, downgrade, or cancel at any time.
        </p>
      </CardFooter>
    </Card>
  )
} 