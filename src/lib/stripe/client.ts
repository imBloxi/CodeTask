import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const getStripeCustomer = async ({
  email,
  name,
  metadata = {},
}: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) => {
  const customers = await stripe.customers.list({ email })

  if (customers.data.length) {
    const customer = customers.data[0]
    const params: Stripe.CustomerUpdateParams = {
      metadata: {
        ...customer.metadata,
        ...metadata,
      },
    }

    if (name) {
      params.name = name
    }

    const updatedCustomer = await stripe.customers.update(customer.id, params)
    return updatedCustomer
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  })

  return customer
}

export const createCheckoutSession = async ({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  priceId: string
  customerId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })

  return session
}

export const createBillingPortalSession = async ({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export const getSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

export const cancelSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export const updateSubscription = async ({
  subscriptionId,
  params,
}: {
  subscriptionId: string
  params: Stripe.SubscriptionUpdateParams
}) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, params)
  return subscription
}

export const listProducts = async () => {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  })
  return products
}

export const getProduct = async (productId: string) => {
  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })
  return product
}

export const listPrices = async () => {
  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  })
  return prices
}

export const getPrice = async (priceId: string) => {
  const price = await stripe.prices.retrieve(priceId, {
    expand: ['product'],
  })
  return price
} 