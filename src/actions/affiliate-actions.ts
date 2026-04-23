'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/** Login + auto-activate affiliate in a single server round-trip */
export async function loginAndActivateAffiliate(email: string, password: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    // 1. Sign in
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !user) {
        return { error: signInError?.message ?? 'Erro ao fazer login.' }
    }

    // 2. Fetch current affiliate status
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_affiliate, affiliate_token')
        .eq('id', user.id)
        .single()

    // 3. If not yet an affiliate, enable now (server-side, no race condition)
    if (!profile?.is_affiliate) {
        const updates: Record<string, unknown> = { is_affiliate: true }

        if (!profile?.affiliate_token) {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
            updates.affiliate_token = Array.from({ length: 10 }, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ).join('')
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)

        if (updateError) return { error: updateError.message }
    }

    revalidatePath('/dashboard/affiliate')
    return { success: true }
}

/** Full affiliate profile + stats */
export async function getAffiliateData() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Paraleliza todas as consultas de dados do afiliado
    const [
        { data: profile },
        { count: totalClicks },
        { count: totalReferrals },
        { count: activeTrainers },
        { data: commissionsData },
        { data: recentClicks },
        { data: recentReferrals },
        { data: recentCommissions },
        { data: payouts }
    ] = await Promise.all([
        supabase
            .from('profiles')
            .select('id, full_name, avatar_url, is_affiliate, affiliate_token, affiliate_balance, email')
            .eq('id', user.id)
            .single(),
        supabase
            .from('affiliate_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_id', user.id),
        supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('referred_by_id', user.id),
        supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('referred_by_id', user.id)
            .eq('role', 'trainer'),
        supabase
            .from('affiliate_commissions')
            .select('amount, status')
            .eq('affiliate_id', user.id),
        supabase
            .from('affiliate_clicks')
            .select('created_at')
            .eq('affiliate_id', user.id)
            .gte('created_at', sevenDaysAgo)
            .order('created_at', { ascending: true }),
        supabase
            .from('profiles')
            .select('id, full_name, email, role, created_at, avatar_url')
            .eq('referred_by_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10),
        supabase
            .from('affiliate_commissions')
            .select('id, amount, status, description, created_at')
            .eq('affiliate_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10),
        supabase
            .from('affiliate_payouts')
            .select('id, amount, status, created_at')
            .eq('affiliate_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
    ])

    // Cálculos e Processamento
    if (!profile) return null

    const totalEarned = commissionsData
        ?.filter(c => c.status !== 'cancelled')
        .reduce((sum, c) => sum + Number(c.amount), 0) ?? 0

    const pendingAmount = commissionsData
        ?.filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + Number(c.amount), 0) ?? 0

    const conversionRate = (totalClicks ?? 0) > 0
        ? (((totalReferrals ?? 0) / (totalClicks ?? 1)) * 100).toFixed(1)
        : '0.0'

    const clicksPerDay: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        clicksPerDay[key] = 0
    }
    recentClicks?.forEach(c => {
        const key = c.created_at.slice(0, 10)
        if (key in clicksPerDay) clicksPerDay[key]++
    })

    return {
        profile: {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            affiliate_token: profile.affiliate_token,
            affiliate_balance: Number(profile.affiliate_balance) || 0,
            email: profile.email
        },
        stats: {
            totalClicks: totalClicks ?? 0,
            totalReferrals: totalReferrals ?? 0,
            activeTrainers: activeTrainers ?? 0,
            totalEarned,
            pendingAmount,
            balance: Number(profile.affiliate_balance) || 0,
            conversionRate,
        },
        clicksPerDay,
        recentReferrals: recentReferrals ?? [],
        recentCommissions: recentCommissions ?? [],
        payouts: payouts ?? [],
    }
}

/** Enable affiliate for the current user & generate a token */
export async function enableAffiliate() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if already has a token
    const { data: profile } = await supabase
        .from('profiles')
        .select('affiliate_token')
        .eq('id', user.id)
        .single()

    if (profile?.affiliate_token) {
        // Already enabled — just flip the flag
        await supabase
            .from('profiles')
            .update({ is_affiliate: true })
            .eq('id', user.id)
    } else {
        // Generate a unique token
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let token = ''
        for (let i = 0; i < 10; i++) {
            token += chars[Math.floor(Math.random() * chars.length)]
        }

        const { error } = await supabase
            .from('profiles')
            .update({ is_affiliate: true, affiliate_token: token })
            .eq('id', user.id)

        if (error) return { error: error.message }
    }

    revalidatePath('/dashboard/affiliate')
    return { success: true }
}

/** Request a payout */
export async function requestPayout(amount: number, method: string, details: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('affiliate_balance')
        .eq('id', user.id)
        .single()

    const balance = profile?.affiliate_balance ?? 0
    if (amount > balance) return { error: 'Saldo insuficiente' }
    if (amount < 50) return { error: 'Valor mínimo para saque é R$ 50,00' }

    const { error } = await supabase
        .from('affiliate_payouts')
        .insert({
            affiliate_id: user.id,
            amount,
            payout_method: method,
            payout_details: { details },
            status: 'requested',
        })

    if (error) return { error: error.message }

    // Deduct from balance
    await supabase
        .from('profiles')
        .update({ affiliate_balance: balance - amount })
        .eq('id', user.id)

    revalidatePath('/dashboard/affiliate')
    revalidatePath('/dashboard/affiliate/earnings')
    return { success: true }
}

/** Get ALL referrals for the referrals page */
export async function getAffiliateReferrals() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: referrals } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at, avatar_url, plan_tier, trainer_code')
        .eq('referred_by_id', user.id)
        .order('created_at', { ascending: false })

    // Add "status" based on plan_tier
    return referrals?.map(r => ({
        ...r,
        status: (r.plan_tier && r.plan_tier !== 'none' && r.plan_tier !== 'start') ? 'active' : 'lead'
    })) ?? []
}

/** Get ALL commissions and payouts for the earnings page */
export async function getAffiliateTransactions() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { commissions: [], payouts: [], checks: { available: 0, pending: 0, paid: 0 } }

    const [{ data: commissions }, { data: payouts }] = await Promise.all([
        supabase
            .from('affiliate_commissions')
            .select('*')
            .eq('affiliate_id', user.id)
            .order('created_at', { ascending: false }),
        supabase
            .from('affiliate_payouts')
            .select('*')
            .eq('affiliate_id', user.id)
            .order('created_at', { ascending: false })
    ])

    // Calculate totals
    const available = commissions
        ?.filter(c => c.status === 'confirmed')
        .reduce((sum, c) => sum + Number(c.amount), 0) ?? 0

    const pending = commissions
        ?.filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + Number(c.amount), 0) ?? 0

    // Total paid out
    const paid = payouts
        ?.filter(p => p.status === 'completed' || p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0) ?? 0

    return {
        commissions: commissions ?? [],
        payouts: payouts ?? [],
        checks: {
            available,
            pending,
            paid
        }
    }
}

/** Get detailed stats for the stats page (30 days) */
export async function getAffiliateStatsDetails() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [
        { data: clicks },
        { count: totalClicks },
        { count: totalReferrals },
        { count: payingReferrals }
    ] = await Promise.all([
        supabase
            .from('affiliate_clicks')
            .select('created_at')
            .eq('affiliate_id', user.id)
            .gte('created_at', thirtyDaysAgo)
            .order('created_at', { ascending: true }),
        supabase
            .from('affiliate_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_id', user.id),
        supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('referred_by_id', user.id),
        supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('referred_by_id', user.id)
            .neq('plan_tier', 'none')
            .neq('plan_tier', 'start')
    ])

    const clicksPerDay: Record<string, number> = {}
    // Initialize 30 days
    for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        // Format YYYY-MM-DD for consistency
        const key = d.toISOString().slice(0, 10)
        clicksPerDay[key] = 0
    }

    clicks?.forEach(c => {
        const key = c.created_at.slice(0, 10)
        if (key in clicksPerDay) clicksPerDay[key]++
    })

    const clickToSignup = (totalClicks ?? 0) > 0
        ? (((totalReferrals ?? 0) / (totalClicks ?? 1)) * 100).toFixed(1)
        : '0.0'

    const signupToPaid = (totalReferrals ?? 0) > 0
        ? (((payingReferrals ?? 0) / (totalReferrals ?? 1)) * 100).toFixed(1)
        : '0.0'

    return {
        clicksPerDay,
        conversion: {
            clickToSignup: Number(clickToSignup),
            signupToPaid: Number(signupToPaid),
            totalClicks: totalClicks ?? 0,
            totalReferrals: totalReferrals ?? 0,
            payingReferrals: payingReferrals ?? 0
        }
    }
}
