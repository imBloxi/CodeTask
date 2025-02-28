import { Metadata } from 'next'
import { PricingCards } from '@/components/pricing/pricing-cards'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the perfect plan for your needs',
}

export default function PricingPage() {
  return (
    <div className="container relative">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 py-20 text-center">
        <h1 className="text-3xl font-bold sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Choose the perfect plan for your needs. All plans include a 14-day free trial.
        </p>
      </div>
      <PricingCards />
    </div>
  )
} 