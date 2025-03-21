'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscription } from '@/hooks/use-subscription'
import { useWorkspace } from '@/hooks/use-workspace'

export function BillingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [renewalDate, setRenewalDate] = useState('')
  const { subscription, createPortalSession } = useSubscription()
  const { workspace } = useWorkspace()
  const router = useRouter()

  useEffect(() => {
    if (subscription?.current_period_end) {
      const formatter = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      })
      setRenewalDate(formatter.format(new Date(subscription.current_period_end)))
    }
  }, [subscription])

  const handlePortalSession = async () => {
    if (!workspace) {
      router.push('/dashboard')
      return
    }

    try {
      setIsLoading(true)
      const response = await createPortalSession()
      
      // Validate that url exists and is a string
      if (response?.url && typeof response.url === 'string') {
        // Security check for allowed domains
        const url = response.url // Store it to a local constant to avoid the possibly null error
        const allowedDomains = ['https://stripe.com', 'https://billing.stripe.com']
        const isAllowed = allowedDomains.some(domain => url.startsWith(domain))
        
        if (isAllowed) {
          router.push(url)
        } else {
          console.error('Unexpected redirect URL:', url)
        }
      } else {
        console.error('Invalid URL received from createPortalSession:', response)
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = () => {
    setIsLoading(true)
    router.push('/pricing')
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
                ? renewalDate
                  ? `Your plan renews on ${renewalDate}`
                  : 'Renewal date unavailable'
                : 'Limited features'}
            </div>
          </div>
          <Button
            variant={subscription ? 'outline' : 'default'}
            onClick={subscription ? handlePortalSession : handleUpgrade}
            disabled={isLoading}
          >
            {subscription ? 'Manage Subscription' : 'Upgrade'}
          </Button>
        </div>
      </CardContent>
      <CardHeader className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <p>
          Manage your subscription on Stripe. You can upgrade, downgrade, or cancel at any time.
        </p>
      </CardHeader>
    </Card>
  )
} 