import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
    // Verify Webhook Token for security
    const authToken = req.headers.get('asaas-access-token')
    const secretToken = process.env.ASAAS_WEBHOOK_TOKEN

    if (secretToken && authToken !== secretToken) {
        console.warn('[ASAAS WEBHOOK] Unauthorized request attempt')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const event = body.event
    const data = body.payment || body.subscription

    console.log(`[ASAAS WEBHOOK] Event: ${event}`, body)

    const admin = createAdminClient()
    if (!admin) {
        return NextResponse.json({ error: 'Admin client unavailable' }, { status: 500 })
    }

    try {
        switch (event) {
            case 'PAYMENT_CONFIRMED':
            case 'PAYMENT_RECEIVED': {
                // If it's a payment from a subscription
                const customerId = body.payment?.customer
                const subscriptionId = body.payment?.subscription

                if (!customerId) break

                const updatePayload: Record<string, any> = {
                    asaas_customer_id: customerId,
                }

                if (subscriptionId) {
                    updatePayload.asaas_subscription_id = subscriptionId
                }

                // Try to find if it's auto_training or trainer plan
                // In Asaas, we might use externalReference
                const externalRef = body.payment?.externalReference || body.subscription?.externalReference

                if (externalRef) {
                    const [userId, tier] = externalRef.split('_')

                    if (tier === 'auto_training') {
                        updatePayload.auto_training_status = 'active'
                    } else if (tier === 'on_demand') {
                        updatePayload.plan_tier = 'on_demand'
                    }

                    const { error } = await (admin as any)
                        .from('profiles')
                        .update(updatePayload)
                        .eq('id', userId)

                    if (error) console.error('[ASAAS WEBHOOK] Error updating profile:', error)
                } else {
                    // Fallback to customer ID lookup
                    const { error } = await (admin as any)
                        .from('profiles')
                        .update(updatePayload)
                        .eq('asaas_customer_id', customerId)

                    if (error) console.error('[ASAAS_WEBHOOK] Error updating profile by customer ID:', error)
                }
                break
            }

            case 'SUBSCRIPTION_DELETED': {
                const customerId = body.subscription?.customer
                const externalRef = body.subscription?.externalReference

                const updatePayload: Record<string, any> = {
                    asaas_subscription_id: null,
                }

                if (externalRef) {
                    const [userId, tier] = externalRef.split('_')
                    if (tier === 'auto_training') {
                        updatePayload.auto_training_status = 'expired'
                    } else {
                        updatePayload.plan_tier = 'none'
                    }
                    await (admin as any).from('profiles').update(updatePayload).eq('id', userId)
                } else {
                    // Fallback
                    await (admin as any).from('profiles').update({ plan_tier: 'none' }).eq('asaas_customer_id', customerId)
                }
                break
            }

            default:
                console.log(`[ASAAS WEBHOOK] Unhandled event: ${event}`)
        }
    } catch (error: any) {
        console.error('[ASAAS WEBHOOK] Handler error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
