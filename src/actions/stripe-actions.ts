'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Stripe Integration Placeholder
 * This file is prepared for future Stripe checkout session logic.
 * Even with the paywall active, administrators can manually grant tiers 
 * via the /admin panel for testers.
 */

export async function createCheckoutSession(tier: 'start' | 'pro' | 'elite', period: 'monthly' | 'quarterly' | 'annual') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    // Mocking Stripe logic for now
    // In production, this would return a Stripe Checkout URL
    console.log(`[STRIPE MOCK] Creating session for ${tier} (${period}) for user ${user.id}`)

    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
        success: true,
        url: null, // Would be stripe checkout url
        isMock: true
    }
}
