import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

const FREE_STUDENTS_LIMIT = 5

export async function POST(req: Request) {
    const body = await req.text()
    const sig = (await headers()).get('stripe-signature')

    if (!sig) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: ReturnType<typeof stripe.webhooks.constructEvent>

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error(`[STRIPE WEBHOOK] Signature error: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const admin = createAdminClient()
    if (!admin) {
        return NextResponse.json({ error: 'Admin client unavailable' }, { status: 500 })
    }

    try {
        switch (event.type) {

            // ✅ Checkout completed → ativa o plano on_demand no Supabase
            case 'checkout.session.completed': {
                const session = event.data.object as any
                const { user_id, plan } = session.metadata || {}

                if (!user_id) {
                    console.error('[STRIPE WEBHOOK] Missing user_id in metadata')
                    break
                }

                console.log(`[STRIPE WEBHOOK] Checkout completed for user ${user_id}`)

                const updatePayload: Record<string, any> = {
                    stripe_subscription_id: session.subscription,
                    stripe_customer_id: session.customer,
                }

                if (plan === 'auto_training') {
                    updatePayload.auto_training_status = 'active'
                } else {
                    updatePayload.plan_tier = 'on_demand'
                }

                const { error } = await (admin as any)
                    .from('profiles')
                    .update(updatePayload)
                    .eq('id', user_id)

                if (error) {
                    console.error('[STRIPE WEBHOOK] Error activating plan:', error)
                } else {
                    console.log(`[STRIPE WEBHOOK] ✅ Plan activated for user ${user_id}`)
                }
                break
            }

            // 📊 Invoice upcoming → reporta uso de alunos ao Stripe (3-7 dias antes do vencimento)
            case 'invoice.upcoming': {
                const invoice = event.data.object as any
                const customerId = invoice.customer
                const subscriptionId = invoice.subscription

                if (!customerId) break

                // Busca o user pelo stripe_customer_id
                const { data: profile } = await (admin as any)
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single()

                if (!profile?.id) {
                    console.error(`[STRIPE WEBHOOK] User not found for customer ${customerId}`)
                    break
                }

                // Conta alunos ativos
                const { count: activeStudents } = await admin
                    .from('trainer_students')
                    .select('*', { count: 'exact', head: true })
                    .eq('trainer_id', profile.id)
                    .eq('active', true)

                const billable = Math.max(0, (activeStudents || 0) - FREE_STUDENTS_LIMIT)

                console.log(`[STRIPE WEBHOOK] User ${profile.id} has ${activeStudents} students, ${billable} billable`)

                // Reporta uso ao Stripe Billing Meter
                if (billable > 0) {
                    await stripe.billing.meterEvents.create({
                        event_name: 'active_students',
                        payload: {
                            stripe_customer_id: customerId,
                            value: String(billable),
                        },
                    })
                    console.log(`[STRIPE WEBHOOK] ✅ Reported ${billable} billable students for customer ${customerId}`)
                } else {
                    console.log(`[STRIPE WEBHOOK] No billable students for customer ${customerId} (${activeStudents || 0} ≤ ${FREE_STUDENTS_LIMIT} free)`)
                }
                break
            }

            // 🔄 Subscription updated → sincroniza status de cancelamento e datas
            case 'customer.subscription.updated': {
                const subscription = event.data.object as any
                const customerId = subscription.customer
                const plan = subscription.metadata?.plan || subscription.metadata?.tier

                const updatePayload: Record<string, any> = {
                    stripe_cancel_at_period_end: subscription.cancel_at_period_end,
                    stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                }

                // Se o cancelamento foi revertido e estava expirado, reativa!
                if (!subscription.cancel_at_period_end) {
                    if (plan === 'auto_training') {
                        updatePayload.auto_training_status = 'active'
                    } else {
                        updatePayload.plan_tier = 'on_demand'
                    }
                }

                const { error } = await (admin as any)
                    .from('profiles')
                    .update(updatePayload)
                    .eq('stripe_customer_id', customerId)

                if (error) {
                    console.error('[STRIPE WEBHOOK] Error updating subscription state:', error)
                } else {
                    console.log(`[STRIPE WEBHOOK] ✅ Subscription updated for customer ${customerId}`)
                }
                break
            }

            // ❌ Subscription deleted → desativa o plano
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any
                const customerId = subscription.customer

                const plan = subscription.metadata?.plan

                const updatePayload: Record<string, any> = {
                    stripe_subscription_id: null,
                    stripe_cancel_at_period_end: false,
                    stripe_current_period_end: null
                }

                if (plan === 'auto_training') {
                    updatePayload.auto_training_status = 'expired'
                } else {
                    updatePayload.plan_tier = 'none'
                }

                const { error } = await (admin as any)
                    .from('profiles')
                    .update(updatePayload)
                    .eq('stripe_customer_id', customerId)

                if (error) {
                    console.error('[STRIPE WEBHOOK] Error deactivating plan:', error)
                } else {
                    console.log(`[STRIPE WEBHOOK] ✅ Plan deactivated for customer ${customerId}`)
                }
                break
            }

            // ⚠️ Pagamento falhou
            case 'invoice.payment_failed': {
                const invoice = event.data.object as any
                console.warn(`[STRIPE WEBHOOK] ⚠️ Payment failed for customer ${invoice.customer}`)
                // TODO: notificar treinador por email
                break
            }

            default:
                console.log(`[STRIPE WEBHOOK] Unhandled event: ${event.type}`)
        }
    } catch (error: any) {
        console.error('[STRIPE WEBHOOK] Handler error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
