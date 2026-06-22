'use server'

import { createClient } from '@/lib/supabase/server'
import { fetchAsaas } from '@/lib/asaas'
import { revalidatePath } from 'next/cache'
import { DEFAULT_FREE_STUDENTS_LIMIT, ON_DEMAND_PRICE_PER_STUDENT } from '@/lib/constants'
import { getPlanPricing } from '@/actions/admin-actions'
import { getTrainerPlanFeatures } from '@/actions/plan-features-actions'

export async function searchAsaasCustomer(cpfCnpj: string) {
    try {
        const cleanTaxId = cpfCnpj.replace(/\D/g, '')
        console.log(`[ASAAS_DEBUG] Searching for customer with CPF/CNPJ: ${cleanTaxId} (Raw: ${cpfCnpj})`)
        const res = await fetchAsaas(`/customers?cpfCnpj=${cleanTaxId}`)

        console.log(`[ASAAS_DEBUG] Asaas Response raw:`, JSON.stringify(res))

        if (res.data && res.data.length > 0) {
            console.log(`[ASAAS_DEBUG] Customer found! Name: ${res.data[0].name}`)
            return { success: true, name: res.data[0].name }
        }

        console.log(`[ASAAS_DEBUG] Customer not found for this CPF/CNPJ.`)
        return { success: false }
    } catch (e: any) {
        console.error(`[ASAAS_DEBUG] Error searching customer:`, e)
        return { success: false }
    }
}

export async function getOrCreateAsaasCustomer(cpfCnpj?: string, fullName?: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autorizado')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profile?.asaas_customer_id) {
        try {
            // Verify if customer still exists in Asaas (handles env swaps)
            const customer = await fetchAsaas(`/customers/${profile.asaas_customer_id}`)

            // If we have a new name provided, update it in Asaas if it differs significantly
            if (fullName && customer.name !== fullName) {
                await fetchAsaas(`/customers/${profile.asaas_customer_id}`, {
                    method: 'POST',
                    body: JSON.stringify({ name: fullName })
                })
            }

            return profile.asaas_customer_id
        } catch (e) {
            console.log(`[ASAAS_DEBUG] Cached customer ${profile.asaas_customer_id} is invalid or from another env. Recreating...`)
            // Clear invalid ID
            await supabase.from('profiles').update({ asaas_customer_id: null }).eq('id', user.id)
        }
    }

    // Create customer in Asaas
    const customer = await fetchAsaas('/customers', {
        method: 'POST',
        body: JSON.stringify({
            name: fullName || profile?.full_name || user.email?.split('@')[0],
            email: user.email,
            cpfCnpj: cpfCnpj || profile?.cpf_cnpj,
            externalReference: user.id
        })
    })

    console.log(`[ASAAS_DEBUG] Customer created: ${customer.id}`)

    // Store in DB
    const updates: any = { asaas_customer_id: customer.id }
    if (cpfCnpj) updates.cpf_cnpj = cpfCnpj

    await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

    return customer.id
}

export async function createAsaasSubscription(
    tier: string,
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' = 'PIX',
    taxId?: string,
    fullName?: string,
    creditCardData?: {
        holderName: string,
        number: string,
        expiryMonth: string,
        expiryYear: string,
        ccv: string,
        postalCode: string,
        addressNumber: string
    },
    planId?: string
) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    try {
        console.log(`\n\n[ASAAS_AUDIT_DEBUG] --- START createAsaasSubscription ---`)
        console.log(`[ASAAS_AUDIT_DEBUG] Params received -> tier: ${tier}, billingType: ${billingType}, planId: ${planId}`)

        const { data: profile } = await supabase.from('profiles').select('is_billing_exempt, email, whatsapp, cpf_cnpj').eq('id', user.id).single()

        if (profile?.is_billing_exempt) {
            console.log(`[ASAAS_AUDIT_DEBUG] EARLY RETURN: User is billing_exempt. Returning { success: true } without hitting Asaas.`)
            await supabase.from('profiles').update({ 
                plan_tier: tier,
                ...(planId ? { plan_id: planId } : {})
            }).eq('id', user.id)
            revalidatePath('/')
            return { success: true }
        }

        const customerId = await getOrCreateAsaasCustomer(taxId, fullName)
        console.log(`[ASAAS_DEBUG] Using Customer ID: ${customerId}`)

        let value: number = 0

        if (tier === 'auto_training') {
            // TODO: Auto-training price could also be dynamic, but keeping fallback for now
            value = ON_DEMAND_PRICE_PER_STUDENT
        } else if (tier === 'on_demand') {
            // Calculate value for on_demand (price per student after the first few free)
            const { count } = await supabase
                .from('trainer_students')
                .select('*', { count: 'exact', head: true })
                .eq('trainer_id', user.id)
                .eq('active', true)

            const features = await getTrainerPlanFeatures(user.id)
            const freeStudentsLimit = features?.free_students_limit ?? DEFAULT_FREE_STUDENTS_LIMIT
            const pricePerStudentCents = features?.price_per_student_cents ?? (ON_DEMAND_PRICE_PER_STUDENT * 100)
            const pricePerStudent = pricePerStudentCents / 100

            const totalStudents = count || 0
            const billable = Math.max(0, totalStudents - freeStudentsLimit)
            value = billable * pricePerStudent
        } else if (planId) {
            const adminClient = await import('@/lib/supabase/admin').then(m => m.adminClient)
            const { data: plan } = await adminClient.from('plans').select('base_price_cents').eq('id', planId).single()
            if (plan) {
                value = plan.base_price_cents / 100
            } else {
                console.error(`[ASAAS_ERROR] Plan ${planId} not found in database!`)
            }
        }

        console.log(`[ASAAS_AUDIT_DEBUG] Calculated value: ${value}`)

        // If the value is 0 (Case of trainer with < 5 students), just activate the account
        if (value === 0 && tier === 'on_demand') {
            console.log(`[ASAAS_AUDIT_DEBUG] EARLY RETURN: value is 0 and tier is on_demand. Returning { success: true } without hitting Asaas.`)
            await supabase
                .from('profiles')
                .update({ plan_tier: 'on_demand' })
                .eq('id', user.id)

            revalidatePath('/dashboard/trainer/plans')
            return { success: true }
        }

        const subscriptionPayload: any = {
            customer: customerId,
            billingType: billingType,
            value: value,
            nextDueDate: billingType === 'PIX' 
                ? new Date().toISOString().split('T')[0] 
                : new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
            cycle: 'MONTHLY',
            description: `Assinatura RepTrail - ${tier}`,
            externalReference: planId ? `${user.id}_${tier}_${planId}` : `${user.id}_${tier}`
        }

        if (billingType === 'CREDIT_CARD' && creditCardData) {
            const { headers: nextHeaders } = await import('next/headers')
            const clientHeaders = await nextHeaders()
            const forwarded = clientHeaders.get('x-forwarded-for')
            const remoteIp = forwarded ? forwarded.split(',')[0] : '127.0.0.1'

            subscriptionPayload.creditCard = {
                holderName: creditCardData.holderName,
                number: creditCardData.number,
                expiryMonth: creditCardData.expiryMonth,
                expiryYear: creditCardData.expiryYear,
                ccv: creditCardData.ccv
            }
            subscriptionPayload.creditCardHolderInfo = {
                name: creditCardData.holderName,
                email: user.email,
                cpfCnpj: taxId || profile?.cpf_cnpj,
                postalCode: creditCardData.postalCode.replace(/\D/g, ''),
                addressNumber: creditCardData.addressNumber,
                phone: profile?.whatsapp?.replace(/\D/g, '') || '', // Optional but good
                mobilePhone: profile?.whatsapp?.replace(/\D/g, '') || ''
            }
            subscriptionPayload.remoteIp = remoteIp
        }

        const subscription = await fetchAsaas('/subscriptions', {
            method: 'POST',
            body: JSON.stringify(subscriptionPayload)
        })

        // For credit card, Asaas attempts the charge synchronously. If successful, we can optimistically grant access.
        // For PIX/Boleto, the webhook will handle the activation upon payment confirmation.
        const updatePayload: any = {
            asaas_subscription_id: subscription.id,
            asaas_billing_type: billingType,
        }

        if (billingType === 'CREDIT_CARD') {
            updatePayload.plan_tier = tier
            if (planId) updatePayload.plan_id = planId
        }

        // Store subscription ID
        await supabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', user.id)

        // Fetch the first payment of this subscription to get the invoice URL
        let firstPayment = null
        for (let i = 0; i < 5; i++) {
            const payments = await fetchAsaas(`/subscriptions/${subscription.id}/payments`)
            if (payments.data && payments.data.length > 0) {
                firstPayment = payments.data[0]
                break
            }
            await new Promise(r => setTimeout(r, 1000))
        }

        let pixQrCode = null
        if (firstPayment && billingType === 'PIX') {
            try {
                pixQrCode = await fetchAsaas(`/payments/${firstPayment.id}/pixQrCode`)
            } catch (err) {
                console.error('[ASAAS_PIX_QR_CODE_ERROR]', err)
            }
        }

        revalidatePath('/dashboard/trainer/plans')
        revalidatePath('/dashboard/student/plans')

        return {
            success: true,
            subscriptionId: subscription.id,
            status: subscription.status,
            invoiceUrl: firstPayment?.invoiceUrl || firstPayment?.bankSlipUrl,
            bankSlipUrl: firstPayment?.bankSlipUrl,
            pixQrCode
        }
    } catch (e: any) {
        console.error('[ASAAS_SUBSCRIPTION_CRITICAL_ERROR]', e)
        return { error: e.message || 'Erro inesperado na assinatura.' }
    }
}

export async function getSubscriptionFirstPaymentPix(subscriptionId: string) {
    try {
        const payments = await fetchAsaas(`/subscriptions/${subscriptionId}/payments`)
        if (payments.data && payments.data.length > 0) {
            const firstPayment = payments.data[0]
            const pixQrCode = await fetchAsaas(`/payments/${firstPayment.id}/pixQrCode`)
            return { success: true, pixQrCode }
        }
        return { success: false, reason: 'PAYMENT_NOT_GENERATED' }
    } catch (err: any) {
        return { success: false, reason: err.message }
    }
}

export async function cancelAsaasSubscription() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Não autorizado' }

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (!profile?.asaas_subscription_id) {
            // Just reset local status if no remote sub
            const updatePayload: any = {}
            if (profile?.role === 'trainer') updatePayload.plan_tier = 'none'
            if (profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial') {
                updatePayload.auto_training_status = 'expired'
            }
            await supabase.from('profiles').update(updatePayload).eq('id', user.id)
            revalidatePath('/')
            return { success: true }
        }

        // Delete in Asaas
        await fetchAsaas(`/subscriptions/${profile.asaas_subscription_id}`, {
            method: 'DELETE'
        })

        // Update in Supabase
        const updatePayload: any = {
            asaas_subscription_id: null,
            asaas_billing_type: null
        }

        if (profile.role === 'trainer') {
            updatePayload.plan_tier = 'none'
        } else {
            updatePayload.auto_training_status = 'expired'
        }

        await supabase.from('profiles').update(updatePayload).eq('id', user.id)

        revalidatePath('/dashboard/trainer/plans')
        revalidatePath('/dashboard/student/plans')
        revalidatePath('/')

        return { success: true }
    } catch (e: any) {
        console.error('[ASAAS_CANCEL_ERROR]', e.message)
        return { success: false, error: e.message }
    }
}

/** Create a real transfer (Payout) via Asaas */
export async function createAsaasTransfer(params: {
    amount: number,
    pixAddressKey: string,
    pixAddressKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP',
    description: string
}) {
    // Note: Transfers usually require a business account with balance
    try {
        const transfer = await fetchAsaas('/transfers', {
            method: 'POST',
            body: JSON.stringify({
                value: params.amount,
                pixAddressKey: params.pixAddressKey,
                pixAddressKeyType: params.pixAddressKeyType,
                description: params?.description,
                operationType: 'PIX'
            })
        })

        return { success: true, transferId: transfer.id }
    } catch (e: any) {
        console.error('[ASAAS_TRANSFER_ERROR]', e.message)
        return { success: false, error: e.message }
    }
}

export async function assignFreePlan(planId: string, planSlug: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ 
                plan_id: planId,
                plan_tier: planSlug === 'on_demand' ? 'on_demand' : 'none' // backward compatibility
            })
            .eq('id', user.id)

        if (error) throw error

        revalidatePath('/')
        return { success: true }
    } catch (e: any) {
        console.error('[ASSIGN_FREE_PLAN_ERROR]', e)
        return { error: 'Erro ao assinar plano gratuito.' }
    }
}

export async function checkSubscriptionRenewalState() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('asaas_subscription_id, asaas_billing_type')
            .eq('id', user.id)
            .single()

        if (!profile?.asaas_subscription_id) return { success: true, noSubscription: true }

        const subscription = await fetchAsaas(`/subscriptions/${profile.asaas_subscription_id}`)
        
        if (subscription.status === 'OVERDUE' || subscription.status === 'EXPIRED') {
            await supabase.from('profiles').update({
                plan_tier: 'none',
                asaas_subscription_id: null
            }).eq('id', user.id)

            revalidatePath('/dashboard')
            return { success: true, isExpired: true }
        }

        if (subscription.status === 'ACTIVE' && subscription.billingType === 'PIX' && subscription.nextDueDate) {
            const due = new Date(subscription.nextDueDate)
            const today = new Date()
            
            due.setHours(0,0,0,0)
            today.setHours(0,0,0,0)
            
            const diffTime = due.getTime() - today.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays <= 3 && diffDays >= 0) {
                return { success: true, shouldWarn: true, daysRemaining: diffDays, billingType: 'PIX' }
            }
        }

        return { success: true }
    } catch (e: any) {
        console.error('[CHECK_RENEWAL_ERROR]', e)
        return { success: false }
    }
}




