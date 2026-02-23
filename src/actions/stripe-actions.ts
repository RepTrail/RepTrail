'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { STRIPE_PRICES } from '@/lib/stripe-config'

const FREE_STUDENTS_LIMIT = 5
const PRICE_PER_STUDENT = 10.90 // R$ por aluno/mês acima do limite grátis

export async function createCheckoutSession(
    tier: 'on_demand',
    period: 'monthly',
    studentCount?: number
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const priceId = process.env.STRIPE_PRICE_ON_DEMAND

    // Mock mode se a chave não estiver configurada
    if (!priceId || priceId === 'price_COLE_AQUI') {
        console.log(`[STRIPE MOCK] On Demand checkout - User: ${user.id}, Alunos: ${studentCount}`)
        await new Promise(resolve => setTimeout(resolve, 800))
        return {
            success: true,
            url: null,
            isMock: true,
            message: 'Configure STRIPE_PRICE_ON_DEMAND no .env.local para ativar o checkout real.'
        }
    }

    const origin = (await headers()).get('origin') || 'http://localhost:3000'

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    // Metered billing: não passa quantity aqui
                },
            ],
            success_url: `${origin}/dashboard/trainer/plans/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/trainer/plans`,
            customer_email: user.email,
            metadata: {
                user_id: user.id,
                tier: 'on_demand',
                period: 'monthly',
            },
            subscription_data: {
                metadata: {
                    user_id: user.id,
                    tier: 'on_demand',
                },
            },
        })

        return { success: true, url: session.url }
    } catch (e: any) {
        console.error('[STRIPE ERROR]', e.message)
        return { error: e.message }
    }
}

export async function createStudentAutoTrainingCheckoutSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const origin = (await headers()).get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: STRIPE_PRICES.AUTO_TRAINING_MONTHLY.id,
                quantity: 1,
            },
        ],
        success_url: `${origin}/dashboard/student/plans/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard/student/plans`,
        customer_email: user.email,
        metadata: {
            user_id: user.id,
            plan: 'auto_training',
        },
        subscription_data: {
            metadata: {
                user_id: user.id,
                plan: 'auto_training',
            },
        },
    })

    if (session.url) {
        redirect(session.url)
    }
}

/**
 * Reporta o uso atual de alunos ao Stripe (chamado pelo webhook invoice.upcoming).
 * Calcula automaticamente alunos acima do limite grátis.
 */
export async function reportStudentUsage(
    subscriptionItemId: string,
    totalActiveStudents: number
) {
    const billableStudents = Math.max(0, totalActiveStudents - FREE_STUDENTS_LIMIT)

    try {
        // Usa a nova API de Billing Meters
        await stripe.billing.meterEvents.create({
            event_name: 'active_students',
            payload: {
                stripe_customer_id: subscriptionItemId, // será o customer ID
                value: String(billableStudents),
            },
        })
        console.log(`[STRIPE] Reported ${billableStudents} billable students (${totalActiveStudents} total - ${FREE_STUDENTS_LIMIT} free)`)
        return { success: true, billableStudents }
    } catch (e: any) {
        console.error('[STRIPE] Error reporting usage:', e.message)
        return { error: e.message }
    }
}
