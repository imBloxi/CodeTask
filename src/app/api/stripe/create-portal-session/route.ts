import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server-utils'
import { createBillingPortalSession, getStripeCustomer } from '@/lib/stripe/client'

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

    const { workspaceId } = await req.json()

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing workspace ID' },
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

    const portalSession = await createBillingPortalSession({
      customerId: customer.id,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 