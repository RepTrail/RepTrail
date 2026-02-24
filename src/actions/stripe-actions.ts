'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
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
export async function cancelSubscription() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        console.log('[STRIPE CANCEL] Current Profile:', {
            id: profile?.id,
            plan_tier: profile?.plan_tier,
            stripe_subscription_id: profile?.stripe_subscription_id,
            stripe_cancel_at_period_end: profile?.stripe_cancel_at_period_end
        })

        if (!profile?.stripe_subscription_id) {
            // Se não tiver ID da Stripe, apenas garante que os campos no Supabase estão resetados
            const updatePayload: any = {}
            if (profile?.role === 'trainer') updatePayload.plan_tier = 'none'
            if (profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial') {
                updatePayload.auto_training_status = 'expired'
            }

            await supabase.from('profiles').update(updatePayload).eq('id', user.id)
            revalidatePath('/')
            return { success: true, message: 'Plano resetado no sistema.' }
        }

        // Cancela na Stripe ao fim do período
        const sub = await stripe.subscriptions.update(profile.stripe_subscription_id, {
            cancel_at_period_end: true
        })

        // Atualiza no Supabase para refletir o estado de agendamento de cancelamento
        const { error: updateError } = await supabase.from('profiles').update({
            stripe_cancel_at_period_end: true,
            stripe_current_period_end: new Date((sub as any).current_period_end * 1000).toISOString()
        }).eq('id', user.id)

        if (updateError) {
            console.error('[STRIPE CANCEL] Supabase Update Error:', updateError)
            return { success: false, error: 'Erro ao atualizar status no banco de dados.' }
        }

        console.log(`[STRIPE CANCEL] Successfully updated profile ${user.id} to cancel_at_period_end: true`)

        revalidatePath('/dashboard/trainer/profile')
        revalidatePath('/dashboard/student/plans')
        revalidatePath('/')
        return { success: true }
    } catch (e: any) {
        console.error('[STRIPE CANCEL ERROR]', e.message)
        return { success: false, error: e.message }
    }
}

export async function reactivateSubscription() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_subscription_id')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_subscription_id) {
            return { success: false, error: 'Assinatura não encontrada' }
        }

        // Reativa na Stripe
        const sub = await stripe.subscriptions.update(profile.stripe_subscription_id, {
            cancel_at_period_end: false
        })

        // Atualiza no Supabase
        await supabase.from('profiles').update({
            stripe_cancel_at_period_end: false,
            stripe_current_period_end: new Date((sub as any).current_period_end * 1000).toISOString()
        }).eq('id', user.id)

        revalidatePath('/dashboard/trainer/profile')
        revalidatePath('/dashboard/student/plans')
        revalidatePath('/')
        return { success: true }
    } catch (e: any) {
        console.error('[STRIPE REACTIVATE ERROR]', e.message)
        return { success: false, error: e.message }
    }
}
