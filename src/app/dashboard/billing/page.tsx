import { Metadata } from 'next'
import { BillingForm } from '@/components/billing/billing-form'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your billing and subscription',
}

export default function BillingPage() {
  return (
    <div className="container relative">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 py-20">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Manage your billing and subscription settings
          </p>
        </div>
        <BillingForm />
      </div>
    </div>
  )
} 