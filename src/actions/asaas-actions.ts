'use server'

import { createClient } from '@/lib/supabase/server'
import { fetchAsaas } from '@/lib/asaas'
import { revalidatePath } from 'next/cache'

export async function getOrCreateAsaasCustomer(cpfCnpj?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autorizado')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profile?.asaas_customer_id) {
        // If we have a customer ID but Asaas now requires a CPF we didn't have before, 
        // we might need to update the customer. For now let's keep it simple.
        return profile.asaas_customer_id
    }

    // Create customer in Asaas
    const customer = await fetchAsaas('/customers', {
        method: 'POST',
        body: JSON.stringify({
            name: profile?.full_name || user.email?.split('@')[0],
            email: user.email,
            cpfCnpj: cpfCnpj || profile?.cpf_cnpj,
            externalReference: user.id
        })
    })

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
    tier: 'on_demand' | 'auto_training',
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' = 'PIX',
    taxId?: string
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    try {
        const customerId = await getOrCreateAsaasCustomer(taxId)

        // Calculate value for on_demand (10.90 per student after the first 5 free)
        let value = tier === 'auto_training' ? 10.90 : 0

        if (tier === 'on_demand') {
            const { count } = await supabase
                .from('trainer_students')
                .select('*', { count: 'exact', head: true })
                .eq('trainer_id', user.id)
                .eq('active', true)

            const activeStudents = count || 0
            const FREE_LIMIT = 5
            const PRICE_PER_EXTRA = 10.90
            const billable = Math.max(0, activeStudents - FREE_LIMIT)
            value = billable * PRICE_PER_EXTRA
        }

        // If the value is 0 (Case of trainer with < 5 students), just activate the account
        if (value === 0 && tier === 'on_demand') {
            await supabase
                .from('profiles')
                .update({ plan_tier: 'on_demand' })
                .eq('id', user.id)

            revalidatePath('/dashboard/trainer/plans')
            return { success: true }
        }

        const subscription = await fetchAsaas('/subscriptions', {
            method: 'POST',
            body: JSON.stringify({
                customer: customerId,
                billingType: billingType,
                value: value,
                nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0], // Amanhã
                cycle: 'MONTHLY',
                description: `Assinatura RepTrail - ${tier}`,
                externalReference: `${user.id}_${tier}`
            })
        })

        // Store subscription ID
        await supabase
            .from('profiles')
            .update({
                asaas_subscription_id: subscription.id,
                asaas_billing_type: billingType,
                plan_tier: tier // Mark as active if subscription created
            })
            .eq('id', user.id)

        revalidatePath('/dashboard/trainer/plans')
        revalidatePath('/dashboard/student/plans')

        return {
            success: true,
            subscriptionId: subscription.id,
            invoiceUrl: subscription.invoiceUrl, // Link for the first invoice
            bankSlipUrl: subscription.bankSlipUrl // If BOLETO
        }
    } catch (e: any) {
        console.error('[ASAAS_SUBSCRIPTION_ERROR]', e.message)
        return { error: e.message }
    }
}

export async function cancelAsaasSubscription() {
    const supabase = await createClient()
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
                description: params.description,
                operationType: 'PIX'
            })
        })

        return { success: true, transferId: transfer.id }
    } catch (e: any) {
        console.error('[ASAAS_TRANSFER_ERROR]', e.message)
        return { success: false, error: e.message }
    }
}


