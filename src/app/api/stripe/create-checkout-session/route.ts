import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server-utils'
import { createCheckoutSession, getStripeCustomer } from '@/lib/stripe/client'

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { priceId, workspaceId } = await req.json()

    if (!priceId || !workspaceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .single()

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    const customer = await getStripeCustomer({
      email: session.user.email!,
      name: session.user.user_metadata?.full_name,
      metadata: {
        userId: session.user.id,
        workspaceId,
      },
    })

    const checkoutSession = await createCheckoutSession({
      priceId,
      customerId: customer.id,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: session.user.id,
        workspaceId,
        priceId,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 