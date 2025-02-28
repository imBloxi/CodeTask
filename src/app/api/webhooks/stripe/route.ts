import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server-utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('Stripe-Signature')

  let event: Stripe.Event

  try {
    if (!sig) throw new Error('No signature')
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      const supabase = createServerSupabaseClient()

      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProduct(supabase, event.data.object as Stripe.Product)
          break
        case 'product.deleted':
          await deleteProduct(supabase, event.data.object as Stripe.Product)
          break
        case 'price.created':
        case 'price.updated':
          await upsertPrice(supabase, event.data.object as Stripe.Price)
          break
        case 'price.deleted':
          await deletePrice(supabase, event.data.object as Stripe.Price)
          break
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await upsertSubscription(supabase, event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.deleted':
          await deleteSubscription(supabase, event.data.object as Stripe.Subscription)
          break
        case 'payment_intent.succeeded':
          await handleSuccessfulPayment(supabase, event.data.object as Stripe.PaymentIntent)
          break
        case 'payment_intent.payment_failed':
          await handleFailedPayment(supabase, event.data.object as Stripe.PaymentIntent)
          break
        default:
          throw new Error(`Unhandled relevant event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: 'Webhook handler failed' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}

async function upsertProduct(supabase: any, product: Stripe.Product) {
  const { error } = await supabase
    .from('products')
    .upsert({
      id: product.metadata.supabaseId ?? undefined,
      active: product.active,
      name: product.name,
      description: product.description ?? undefined,
      image: product.images?.[0] ?? null,
      metadata: product.metadata,
      stripe_product_id: product.id
    })

  if (error) throw error
}

async function deleteProduct(supabase: any, product: Stripe.Product) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('stripe_product_id', product.id)

  if (error) throw error
}

async function upsertPrice(supabase: any, price: Stripe.Price) {
  const { error } = await supabase
    .from('prices')
    .upsert({
      id: price.metadata.supabaseId ?? undefined,
      active: price.active,
      currency: price.currency,
      description: price.nickname ?? undefined,
      type: price.type,
      unit_amount: price.unit_amount ?? undefined,
      interval: price.recurring?.interval ?? undefined,
      interval_count: price.recurring?.interval_count ?? undefined,
      trial_period_days: price.recurring?.trial_period_days ?? undefined,
      metadata: price.metadata,
      stripe_price_id: price.id
    })

  if (error) throw error
}

async function deletePrice(supabase: any, price: Stripe.Price) {
  const { error } = await supabase
    .from('prices')
    .delete()
    .eq('stripe_price_id', price.id)

  if (error) throw error
}

async function upsertSubscription(supabase: any, subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      id: subscription.metadata.supabaseId ?? undefined,
      user_id: subscription.metadata.userId,
      status: subscription.status,
      metadata: subscription.metadata,
      price_id: subscription.metadata.priceId,
      quantity: subscription.items.data[0].quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      stripe_subscription_id: subscription.id
    })

  if (error) throw error
}

async function deleteSubscription(supabase: any, subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('stripe_subscription_id', subscription.id)

  if (error) throw error
}

async function handleSuccessfulPayment(supabase: any, paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from('billing_history')
    .insert({
      workspace_id: paymentIntent.metadata.workspaceId,
      user_id: paymentIntent.metadata.userId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_invoice_id: paymentIntent.invoice?.toString(),
      metadata: paymentIntent.metadata
    })

  if (error) throw error
}

async function handleFailedPayment(supabase: any, paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from('billing_history')
    .insert({
      workspace_id: paymentIntent.metadata.workspaceId,
      user_id: paymentIntent.metadata.userId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_invoice_id: paymentIntent.invoice?.toString(),
      metadata: paymentIntent.metadata
    })

  if (error) throw error
} 