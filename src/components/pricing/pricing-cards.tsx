'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscription } from '@/hooks/use-subscription'
import { useWorkspace } from '@/hooks/use-workspace'
import { useRouter } from 'next/navigation'

interface Price {
  id: string
  product_id: string
  active: boolean
  description: string | null
  unit_amount: number | null
  currency: string
  type: string
  interval: string | null
  interval_count: number | null
  trial_period_days: number | null
  metadata: Record<string, string>
  products: {
    id: string
    active: boolean
    name: string
    description: string | null
    metadata: Record<string, string>
  } | null
}

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    priceId: '',
    priceMonthly: 0,
    description: 'Perfect for small teams just getting started.',
    features: [
      'Up to 5 team members',
      '1GB storage',
      'Basic task management',
      'Limited integrations',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    priceMonthly: 15,
    description: 'For growing teams that need more.',
    features: [
      'Up to 50 team members',
      '100GB storage',
      'Advanced task management',
      'All integrations',
      'Priority support',
      'Custom fields',
      'Advanced analytics',
    ],
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    priceMonthly: 30,
    description: 'For large teams with advanced needs.',
    features: [
      'Unlimited team members',
      'Unlimited storage',
      'Enterprise task management',
      'Custom integrations',
      'Dedicated support',
      'SSO & advanced security',
      'Custom workflows',
      'SLA guarantee',
    ],
  },
]

export function PricingCards() {
  const [prices, setPrices] = useState<Price[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { subscription, createCheckoutSession } = useSubscription()
  const { workspace } = useWorkspace()
  const router = useRouter()

  useEffect(() => {
    async function fetchPrices() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/stripe/prices')
        const data = await response.json()
        setPrices(data)
      } catch (error) {
        console.error('Error fetching prices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
  }, [])

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) return
    if (!workspace) {
      router.push('/dashboard')
      return
    }

    try {
      setIsLoading(true)
      const { url } = await createCheckoutSession(priceId)
      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pb-20 md:grid-cols-3">
      {tiers.map((tier) => {
        const price = prices.find((p) => p.id === tier.priceId)
        const isCurrentPlan = subscription?.price_id === tier.priceId

        return (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  ${price?.unit_amount ? price.unit_amount / 100 : tier.priceMonthly}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="flex flex-1 flex-col gap-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => tier.priceId && handleSubscribe(tier.priceId)}
                disabled={isLoading || isCurrentPlan || !tier.priceId}
              >
                {isCurrentPlan ? 'Current Plan' : tier.priceId ? 'Subscribe' : 'Free'}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
} 