import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server-utils'
import { listPrices } from '@/lib/stripe/client'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { data: prices } = await supabase
      .from('prices')
      .select('*, products(*)')
      .eq('active', true)
      .order('unit_amount', { ascending: true })

    return NextResponse.json(prices)
  } catch (error: any) {
    console.error('Error fetching prices:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 