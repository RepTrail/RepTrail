'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/** Get full list of affiliates for admin panel */
export async function getAdminAffiliates() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single()

    if (!profile?.is_admin) {
        return { error: 'Unauthorized' }
    }

    const { data: affiliates, error } = await supabase
        .from('profiles')
        .select(`
            id, full_name, email, created_at,
            is_affiliate, affiliate_token, affiliate_balance, commission_rate
        `)
        .eq('is_affiliate', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('getAdminAffiliates Error:', error)
        return { error: error.message }
    }

    if (!affiliates || affiliates.length === 0) {
        return { data: [] }
    }

    const affiliateIds = affiliates.map((a: any) => a.id)

    // Fetch the referrals separately to avoid self-join PostgREST errors
    const { data: allReferrals } = await supabase
        .from('profiles')
        .select(`
            id, role, referred_by_id,
            trainer_students!student_id(active, monthly_fee)
        `)
        .in('referred_by_id', affiliateIds)

    // Calculate detailed stats in JS
    const formatted = affiliates.map((a: any) => {
        const referrals = allReferrals ? allReferrals.filter((r: any) => r.referred_by_id === a.id) : []
        const totalReferrals = referrals.length

        // Active Referrals: Students with active trainer connection
        const activeReferralsCount = referrals.filter((r: any) =>
            r.role === 'student' && r.trainer_students && r.trainer_students.some((ts: any) => ts.active)
        ).length

        // Estimated Monthly Commission
        const monthlyVolume = referrals.reduce((sum: number, r: any) => {
            if (r.role === 'student' && r.trainer_students) {
                const activeSub = r.trainer_students.find((ts: any) => ts.active)
                if (activeSub) return sum + (activeSub.monthly_fee || 0)
            }
            return sum
        }, 0)

        const estimatedMonthlyCommission = monthlyVolume * ((a.commission_rate || 10) / 100)

        return {
            id: a.id,
            full_name: a.full_name,
            email: a.email,
            is_affiliate: a.is_affiliate,
            affiliate_token: a.affiliate_token,
            affiliate_balance: a.affiliate_balance || 0,
            commission_rate: a.commission_rate || 10,
            formatted_created_at: new Date(a.created_at).toLocaleDateString('pt-BR'),
            total_referrals: totalReferrals,
            active_referrals: activeReferralsCount,
            monthly_commission: estimatedMonthlyCommission,
            revenue_generated: monthlyVolume
        }
    })

    return { data: formatted }
}

/** Update commission rate for a specific affiliate */
export async function updateAffiliateCommission(affiliateId: string, rate: number) {
    const supabase = await createClient()

    // Auth check (admin)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user?.id).single()
    if (!profile?.is_admin) return { error: 'Unauthorized' }

    if (rate < 0 || rate > 100) return { error: 'Taxa inválida (0-100)' }

    const { error } = await supabase
        .from('profiles')
        .update({ commission_rate: rate })
        .eq('id', affiliateId)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

/** Reassign a student to a different affiliate (or no affiliate) */
export async function reassignReferral(studentEmail: string, newAffiliateToken: string | null) {
    const supabase = await createClient()

    // Auth check (admin)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user?.id).single()
    if (!profile?.is_admin) return { error: 'Unauthorized' }

    // Find student
    const { data: student } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', studentEmail)
        .single()

    if (!student) return { error: 'Aluno não encontrado' }

    let newAffiliateId = null

    if (newAffiliateToken) {
        // Find new affiliate
        const { data: affiliate } = await supabase
            .from('profiles')
            .select('id')
            .eq('affiliate_token', newAffiliateToken)
            .single()

        if (!affiliate) return { error: 'Afiliado não encontrado com este token' }
        newAffiliateId = affiliate.id
    }

    // Update
    const { error } = await supabase
        .from('profiles')
        .update({ referred_by_id: newAffiliateId })
        .eq('id', student.id)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

/** Promote or Demote a user as Affiliate */
export async function toggleAffiliateStatus(userId: string, isAffiliate: boolean) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user?.id).single()
    if (!profile?.is_admin) return { error: 'Unauthorized' }

    if (isAffiliate) {
        // Check existing data
        const { data: targetProfile } = await supabase
            .from('profiles')
            .select('affiliate_token, commission_rate, full_name, email')
            .eq('id', userId)
            .single()

        if (!targetProfile) return { error: 'User not found' }

        const updates: any = { is_affiliate: true }

        if (!targetProfile.affiliate_token) {
            // Generate token: slug of name or email prefix + random
            const base = (targetProfile.full_name || targetProfile.email || 'user')
                .split('@')[0]
                .replace(/[^a-zA-Z0-9]/g, '')
                .toLowerCase()
                .substring(0, 10)
            const random = Math.floor(Math.random() * 10000).toString()
            updates.affiliate_token = `${base}${random}`
        }

        // Only set default if null/undefined
        if (targetProfile.commission_rate === null || targetProfile.commission_rate === undefined) {
            updates.commission_rate = 10
        }

        const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
        if (error) return { error: error.message }
    } else {
        const { error } = await supabase.from('profiles').update({ is_affiliate: false }).eq('id', userId)
        if (error) return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}
