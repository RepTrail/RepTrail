'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) throw new Error('Unauthorized')
    return { supabase, userId: user.id }
}

export async function getAdminOverview() {
    const { supabase } = await checkAdmin()

    try {
        const { count: totalTrainers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'trainer')
        const { count: totalStudents } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student')
        const { count: totalRelationships } = await supabase.from('trainer_students').select('*', { count: 'exact', head: true })

        const { count: countAffiliates } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_affiliate', true)

        const { data: affiliateBalances } = await supabase.from('profiles').select('affiliate_balance').eq('is_affiliate', true)
        const affiliateDebt = affiliateBalances?.reduce((acc, curr) => acc + (Number(curr.affiliate_balance) || 0), 0) || 0

        // Trainers Subs Revenue
        // Fetch all trainers to check their plans
        // Fetch all trainers to check their plans
        const { data: trainers } = await supabase.from('profiles').select('id, plan_tier, created_at, elite_until').eq('role', 'trainer')

        // Fetch all active students mapped to trainers to calculate usage
        const { data: activeStudents } = await supabase.from('trainer_students').select('trainer_id').eq('active', true)

        const trainerStudentCounts: Record<string, number> = {}
        activeStudents?.forEach(s => {
            if (s.trainer_id) trainerStudentCounts[s.trainer_id] = (trainerStudentCounts[s.trainer_id] || 0) + 1
        })

        const prices: any = { on_demand: 0 }
        const usageRules: any = { on_demand: { limit: 5, price_per_extra: 10.90 } } // New model: 10.90 per student > 5

        let monthlySubsRevenue = 0
        let totalSubsRevenue = 0
        let trialCount = 0
        let studentsInTrial = 0

        console.log('--- Admin Revenue Calc ---')

        trainers?.forEach(t => {
            // Check for active trial
            const isTrialActive = t.elite_until && new Date(t.elite_until) > new Date()

            // If trial is active, subscription revenue is 0
            if (isTrialActive) {
                trialCount++
                studentsInTrial += (trainerStudentCounts[t.id] || 0)
                return
            }

            const p = t.plan_tier || 'on_demand'
            const fixedPrice = prices[p] || 0

            let revenue = fixedPrice

            // If On Demand (or any plan now), add usage fee
            const count = trainerStudentCounts[t.id] || 0
            const { limit, price_per_extra } = usageRules.on_demand
            if (count > limit) {
                revenue += (count - limit) * price_per_extra
            }

            monthlySubsRevenue += revenue

            const start = new Date(t.created_at)
            const now = new Date()
            const months = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1)
            totalSubsRevenue += (revenue * months)
        })

        // --- NEW: Student Auto-Training Revenue ---
        const { data: autoTrainingStudents } = await supabase
            .from('profiles')
            .select('id, created_at')
            .eq('role', 'student')
            .eq('auto_training_status', 'active')

        const studentAutoTrainingPrice = 10.90
        const monthlyStudentRevenue = (autoTrainingStudents?.length || 0) * studentAutoTrainingPrice
        monthlySubsRevenue += monthlyStudentRevenue

        autoTrainingStudents?.forEach(s => {
            const start = new Date(s.created_at)
            const now = new Date()
            const months = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1)
            totalSubsRevenue += (studentAutoTrainingPrice * months)
        })

        // Trainer Volume (Students paying Trainers) - Just purely volume, no tax taken
        const { data: studentsData } = await supabase.from('trainer_students').select('monthly_fee, active, created_at')

        const monthlyTrainerVolume = studentsData?.reduce((acc, curr) => {
            return curr.active ? acc + (Number(curr.monthly_fee) || 0) : acc
        }, 0) || 0

        const totalTrainerVolume = studentsData?.reduce((acc, curr) => {
            if (!curr.active) return acc
            const start = new Date(curr.created_at)
            const now = new Date()
            const months = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1)
            return acc + ((Number(curr.monthly_fee) || 0) * months)
        }, 0) || 0


        // Affiliate Metrics (Calculated early for Net Profit)
        const { data: allCommissions } = await supabase.from('affiliate_commissions').select('amount, created_at, status')
        const affiliateTotalEarnings = allCommissions?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0
        const currentMonthStart = new Date()
        currentMonthStart.setDate(1)
        currentMonthStart.setHours(0, 0, 0, 0)
        const commissionsThisMonth = allCommissions?.reduce((acc, curr) => {
            const date = new Date(curr.created_at)
            if (date >= currentMonthStart && curr.status !== 'cancelled') {
                return acc + (Number(curr.amount) || 0)
            }
            return acc
        }, 0) || 0
        const pendingCommissions = allCommissions?.reduce((acc, curr) => {
            if (curr.status === 'pending' || curr.status === 'confirmed') {
                return acc + (Number(curr.amount) || 0)
            }
            return acc
        }, 0) || 0

        // Platform Gross Revenue (Only Subs/Usage Revenue)
        const monthlyGrossRevenue = monthlySubsRevenue
        const totalGrossRevenue = totalSubsRevenue

        // Operational Costs
        const { data: allCosts } = await supabase.from('operational_costs').select('amount, type, created_at')

        const totalOperationalCosts = allCosts?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

        const monthlyOperationalCosts = allCosts?.reduce((acc, curr) => {
            const date = new Date(curr.created_at)
            if (date >= currentMonthStart) return acc + (Number(curr.amount) || 0)
            return acc
        }, 0) || 0

        // Net Profit Calculation
        // Net = Gross Revenue - Affiliate Commissions - Operational Costs
        const monthlyNetProfit = monthlyGrossRevenue - commissionsThisMonth - monthlyOperationalCosts
        const totalNetProfit = totalGrossRevenue - affiliateTotalEarnings - totalOperationalCosts

        const { count: productClicks } = await supabase.from('product_clicks').select('*', { count: 'exact', head: true })
        const { count: totalProducts } = await supabase.from('store_products').select('*', { count: 'exact', head: true }).eq('is_active', true)

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        const { count: recentSignups } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            .eq('role', 'student')
            .gte('created_at', sevenDaysAgo)

        // Metrics Calculation
        const totalActiveUsers = (totalTrainers || 0) + (totalStudents || 0)
        const activeTrainersCount = totalTrainers || 0

        // Ticket Médio (Nós) -> Quanto ganhamos por personal cadastrado
        const platformTicketPerTrainer = activeTrainersCount > 0 ? (monthlyGrossRevenue / activeTrainersCount) : 0

        // Ticket Médio (Personal) -> Quanto o personal ganha em média
        const trainerAverageTicket = activeTrainersCount > 0 ? (monthlyTrainerVolume / activeTrainersCount) : 0


        return {
            trainers: totalTrainers || 0,
            trialTrainers: trialCount,
            studentsInTrial,
            students: totalStudents || 0,
            relationships: totalRelationships || 0,

            monthlyTrainerVolume,
            totalTrainerVolume,

            monthlyPlatformProfit: monthlyNetProfit, // Now Net Profit
            totalPlatformProfit: totalNetProfit,     // Now Net Profit

            monthlyGrossRevenue,
            totalGrossRevenue,

            monthlyOperationalCosts,
            totalOperationalCosts,

            affiliatesCount: countAffiliates || 0,
            affiliateDebt: affiliateDebt,
            productClicks: productClicks || 0,
            totalProducts: totalProducts || 0,
            recentSignups: recentSignups || 0,

            affiliateTotalEarnings,
            commissionsThisMonth,
            pendingCommissions,
            platformTicketPerTrainer,
            trainerAverageTicket
        }
    } catch (e) {
        console.error('Admin overview error:', e)
        return null
    }
}

export async function getAllUsers(role?: string) {
    const { supabase } = await checkAdmin()
    let query = supabase.from('profiles').select('id, full_name, email, role, plan_tier, is_admin, created_at, avatar_url, trainer_code, is_billing_exempt')
    if (role) query = query.eq('role', role)
    const { data } = await query.order('created_at', { ascending: false })
    return data || []
}

export async function getAllTrainers() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase
        .from('profiles')
        .select(`
            id, full_name, email, plan_tier, average_rating, total_reviews, is_elite, created_at, avatar_url, trainer_code, specialty, region, is_billing_exempt,
            students:trainer_students!trainer_id(monthly_fee, active, created_at)
        `)
        .eq('role', 'trainer')
        .order('created_at', { ascending: false })

    return (data || []).map((t: any) => {
        const students = t.students || []

        // Monthly Recurring Revenue
        const monthlyRevenue = students.reduce((sum: number, s: any) => {
            return s.active ? sum + (Number(s.monthly_fee) || 0) : sum
        }, 0)

        // Estimated Total Revenue (Active Students * Months Active)
        // Note: Does not account for past inactive students fully without historical logs.
        const totalRevenue = students.reduce((sum: number, s: any) => {
            if (!s.active) return sum // Ignore inactive for total as we don't know duration

            const start = new Date(s.created_at)
            const now = new Date()
            const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
            // Include partial month as 1
            const months = Math.max(1, diffMonths + 1)

            return sum + ((Number(s.monthly_fee) || 0) * months)
        }, 0)

        return {
            ...t,
            monthly_revenue: monthlyRevenue,
            total_revenue: totalRevenue
        }
    })
}

export async function updateUserPlanTier(userId: string, planTier: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('profiles').update({
        plan_tier: planTier,
        is_billing_exempt: true, // Auto-exempt when admin activates manually
        elite_until: null // Clear trial status when manually updating plan
    }).eq('id', userId)
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'update_plan_tier', target_id: userId, details: { plan_tier: planTier } })
    revalidatePath('/admin')
    revalidatePath('/dashboard/trainer', 'layout')
    revalidatePath('/dashboard/trainer/plans')
    return { success: true }
}

export async function toggleEliteStatus(userId: string, isElite: boolean) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('profiles').update({ is_elite: isElite }).eq('id', userId)
    if (error) return { error: error.message }
    revalidatePath('/admin')
    revalidatePath('/dashboard/trainer', 'layout')
    revalidatePath('/dashboard/trainer/plans')
    return { success: true }
}

export async function toggleBillingExemption(userId: string, isExempt: boolean) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('profiles').update({ is_billing_exempt: isExempt }).eq('id', userId)
    if (error) return { error: error.message }

    await supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'toggle_billing_exempt',
        target_id: userId,
        details: { is_billing_exempt: isExempt }
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard/trainer', 'layout')
    revalidatePath('/dashboard/trainer/plans')
    return { success: true }
}

export async function grantEliteTrial(userId: string) {
    const { supabase, userId: adminId } = await checkAdmin()

    const eliteUntil = new Date()
    eliteUntil.setDate(eliteUntil.getDate() + 15)

    const { error } = await supabase.from('profiles').update({
        plan_tier: 'elite',
        is_elite: true,
        elite_until: eliteUntil.toISOString(),
        trial_activated_at: new Date().toISOString()
    }).eq('id', userId)

    if (error) return { error: error.message }

    await supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'grant_elite_trial',
        target_id: userId,
        details: { elite_until: eliteUntil.toISOString() }
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard/trainer', 'layout')
    revalidatePath('/dashboard/trainer/plans')
    return { success: true }
}

export async function getAllStoreProducts() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase.from('store_products').select('*').order('created_at', { ascending: false })
    return data || []
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('store_products').update({ is_active: isActive }).eq('id', productId)
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'toggle_product', target_id: productId, details: { is_active: isActive } })
    revalidatePath('/admin')
    return { success: true }
}

export async function addStoreProduct(data: {
    name: string
    description: string
    image_url: string
    official_price: number
    link_url: string
    category: string
    sub_category: string
    rating?: number
    reviews_count?: number
}) {
    const { supabase, userId: adminId } = await checkAdmin()

    // Map PT-BR categories to EN keys if needed, or unify
    const categoryMap: Record<string, string> = {
        'Suplemento': 'supplement',
        'Acessório': 'accessory',
        'Vestuário': 'clothing',
        'Equipamento': 'equipment'
    }
    const finalCategory = categoryMap[data.category] || data.category

    // Ensure image is persisted in our storage
    if (data.image_url && data.image_url.startsWith('http') && !data.image_url.includes('supabase.co')) {
        const uploaded = await uploadImageFromUrl(data.image_url)
        if (uploaded) data.image_url = uploaded
    }

    const { error } = await supabase.from('store_products').insert({
        ...data,
        category: finalCategory,
        is_active: true
    })
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'add_product', details: { ...data, category: finalCategory } })
    revalidatePath('/admin')
    revalidatePath('/dashboard/student/loja/explorar')
    revalidatePath('/dashboard/trainer/loja/explorar')
    return { success: true }
}

export async function getAdminLogs() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase
        .from('admin_logs')
        .select('*, admin:profiles!admin_id(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50)
    return data || []
}

export async function getTopProductsByClicks() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase
        .from('product_clicks')
        .select('product_id, store_products(name, image_url, category)')
        .limit(100)

    if (!data) return []

    // Count clicks per product
    const counts: Record<string, { name: string; image_url: string; category: string; clicks: number }> = {}
    for (const row of data) {
        const p = row.store_products as any
        if (!p) continue
        const id = row.product_id
        if (!counts[id]) counts[id] = { name: p.name, image_url: p.image_url, category: p.category, clicks: 0 }
        counts[id].clicks++
    }
    return Object.entries(counts)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5)
}

export async function getRecentStudentActivity() {
    const { supabase } = await checkAdmin()
    const [workouts, cardios] = await Promise.all([
        supabase
            .from('workout_logs')
            .select(`
                id,
                created_at,
                status,
                student:profiles!student_id(full_name, avatar_url),
                workout:workouts(name)
            `)
            .order('created_at', { ascending: false })
            .limit(15),
        supabase
            .from('cardio_logs')
            .select(`
                id,
                created_at,
                status,
                student:profiles!student_id(full_name, avatar_url),
                cardio:assigned_cardios(cardio:cardios(name))
            `)
            .order('created_at', { ascending: false })
            .limit(15)
    ])

    const workoutActivities = (workouts.data || []).map(w => ({
        ...w,
        type: 'workout'
    }))

    const cardioActivities = (cardios.data || []).map(c => ({
        ...c,
        type: 'cardio',
        workout: (c as any).cardio?.cardio // mapping to 'workout' key so frontend doesn't break
    }))

    const combined = [...workoutActivities, ...cardioActivities]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20)

    return combined
}

// Default prices (fallback if not in DB)
const DEFAULT_PRICES: Record<string, { monthly: number; quarterly_discount: number; annual_discount: number }> = {
    start: { monthly: 49.90, quarterly_discount: 15, annual_discount: 20 },
    pro: { monthly: 149.90, quarterly_discount: 15, annual_discount: 20 },
    elite: { monthly: 299.90, quarterly_discount: 15, annual_discount: 20 },
}

export async function getPlanPricing() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase
        .from('plan_features')
        .select('plan_tier, feature_key, limit_value')
        .in('feature_key', [
            'monthly_price_cents',
            'quarterly_discount_pct',
            'annual_discount_pct',
            'price_per_student_cents',
            'free_students_limit',
            'pro_features_threshold'
        ])

    const result: Record<string, {
        monthly: number;
        quarterly_discount: number;
        annual_discount: number;
        price_per_student?: number;
        free_students_limit?: number;
        pro_features_threshold?: number;
    }> = {
        on_demand: { monthly: 0, quarterly_discount: 0, annual_discount: 0, price_per_student: 20, free_students_limit: 5, pro_features_threshold: 8 },
        start: { ...DEFAULT_PRICES.start },
        pro: { ...DEFAULT_PRICES.pro },
        elite: { ...DEFAULT_PRICES.elite },
    }

    for (const row of data || []) {
        if (!result[row.plan_tier]) continue
        if (row.feature_key === 'monthly_price_cents') result[row.plan_tier].monthly = (row.limit_value || 0) / 100
        if (row.feature_key === 'quarterly_discount_pct') result[row.plan_tier].quarterly_discount = row.limit_value || 0
        if (row.feature_key === 'annual_discount_pct') result[row.plan_tier].annual_discount = row.limit_value || 0
        if (row.feature_key === 'price_per_student_cents') result[row.plan_tier].price_per_student = (row.limit_value || 0) / 100
        if (row.feature_key === 'free_students_limit') result[row.plan_tier].free_students_limit = row.limit_value || 0
        if (row.feature_key === 'pro_features_threshold') result[row.plan_tier].pro_features_threshold = row.limit_value || 0
    }

    return result
}

export async function updatePlanPricing(
    tier: string,
    monthly: number,
    quarterlyDiscount: number,
    annualDiscount: number,
    extras?: {
        price_per_student?: number;
        free_students_limit?: number;
        pro_features_threshold?: number;
    }
) {
    const { supabase, userId: adminId } = await checkAdmin()

    const upserts = [
        { plan_tier: tier, feature_key: 'monthly_price_cents', limit_value: Math.round(monthly * 100) },
        { plan_tier: tier, feature_key: 'quarterly_discount_pct', limit_value: quarterlyDiscount },
        { plan_tier: tier, feature_key: 'annual_discount_pct', limit_value: annualDiscount },
    ]

    if (tier === 'on_demand' && extras) {
        if (extras.price_per_student !== undefined) upserts.push({ plan_tier: tier, feature_key: 'price_per_student_cents', limit_value: Math.round(extras.price_per_student * 100) });
        if (extras.free_students_limit !== undefined) upserts.push({ plan_tier: tier, feature_key: 'free_students_limit', limit_value: extras.free_students_limit });
        if (extras.pro_features_threshold !== undefined) upserts.push({ plan_tier: tier, feature_key: 'pro_features_threshold', limit_value: extras.pro_features_threshold });
    }

    const { error } = await supabase.from('plan_features').upsert(upserts, { onConflict: 'plan_tier,feature_key' })

    if (error) {
        console.error('Error updating plan pricing:', error)
        return { success: false, error: error.message }
    }

    await supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: 'update_plan_pricing',
        details: { tier, monthly, quarterlyDiscount, annualDiscount, extras }
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard/trainer/plans')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const admin = createAdminClient()

    try {
        // Primeiro, vamos deletar manualmente algumas tabelas que podem não ter CASCADE
        // ou que precisam de limpeza específica

        // Deletar arquivos do storage (avatar, progress photos, etc)
        const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', userId)
            .single()

        if (profile?.avatar_url) {
            const avatarPath = profile.avatar_url.split('/').slice(-2).join('/')
            if (avatarPath) {
                await supabase.storage
                    .from('avatars')
                    .remove([avatarPath])
            }
        }

        // Deletar progress photos do storage
        const { data: progressPhotos } = await supabase
            .from('progress_photos')
            .select('front_url, back_url, side_left_url, side_right_url')
            .eq('student_id', userId)

        if (progressPhotos) {
            const photoPaths: string[] = []
            progressPhotos.forEach(photo => {
                ['front_url', 'back_url', 'side_left_url', 'side_right_url'].forEach(key => {
                    const url = (photo as any)[key]
                    if (url) {
                        const path = url.split('/progress-photos/')[1]
                        if (path) photoPaths.push(path)
                    }
                })
            })
            if (photoPaths.length > 0) {
                await supabase.storage
                    .from('progress-photos')
                    .remove(photoPaths)
            }
        }

        // Deletar PDFs do storage
        const { data: pdfUploads } = await supabase
            .from('pdf_uploads')
            .select('file_url')
            .eq('uploader_id', userId)

        if (pdfUploads) {
            const pdfPaths: string[] = []
            pdfUploads.forEach(pdf => {
                if (pdf.file_url) {
                    const path = pdf.file_url.split('/').slice(-2).join('/')
                    if (path) pdfPaths.push(path)
                }
            })
            if (pdfPaths.length > 0) {
                await supabase.storage
                    .from('pdf-uploads')
                    .remove(pdfPaths)
            }
        }

        // Log da ação antes de deletar
        await supabase.from('admin_logs').insert({
            admin_id: adminId,
            action: 'delete_user',
            target_id: userId,
            details: { deleted_at: new Date().toISOString() }
        })

        // Deletar o profile (isso vai cascatear para muitas tabelas devido ao ON DELETE CASCADE)
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId)

        if (profileError) {
            console.error('Erro ao deletar profile:', profileError)
            return { error: `Erro ao deletar dados: ${profileError.message}` }
        }

        // Deletar o usuário do auth (requer admin client)
        if (!admin) {
            console.error('DELETE_USER_ERROR: SUPABASE_SERVICE_ROLE_KEY is missing or admin client failed to initialize.')
            return {
                success: true,
                warning: 'Dados coletados e removidos do banco, mas a conta de LOGIN ainda existe. Motivo: Chave de Admin não encontrada no servidor.'
            }
        }

        const { error: authError } = await admin.auth.admin.deleteUser(userId)

        if (authError) {
            console.error('DELETE_USER_AUTH_ERROR:', authError)
            return {
                success: true,
                warning: `Dados do perfil apagados, mas houve erro no login: ${authError.message}`
            }
        }

        revalidatePath('/admin')
        return { success: true }
    } catch (e: any) {
        console.error('DELETE_USER_CRITICAL_ERROR:', e)
        return { error: `Erro inesperado: ${e.message || 'Consulte os logs do servidor'}` }
    }
}

export async function updateStoreProduct(id: string, data: any) {
    const { supabase, userId: adminId } = await checkAdmin()

    // Map PT-BR categories to EN keys
    const categoryMap: Record<string, string> = {
        'Suplemento': 'supplement',
        'Acessório': 'accessory',
        'Vestuário': 'clothing',
        'Equipamento': 'equipment'
    }
    if (data.category && categoryMap[data.category]) {
        data.category = categoryMap[data.category]
    }

    // Ensure image is persisted in our storage (if it's a new external URL)
    if (data.image_url && data.image_url.startsWith('http') && !data.image_url.includes('supabase.co')) {
        const uploaded = await uploadImageFromUrl(data.image_url)
        if (uploaded) data.image_url = uploaded
    }

    const { error } = await supabase.from('store_products').update(data).eq('id', id)
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'update_product', target_id: id, details: data })
    revalidatePath('/admin')
    revalidatePath('/dashboard/student/loja/explorar')
    revalidatePath('/dashboard/trainer/loja/explorar')
    return { success: true }
}

export async function impersonateUser(targetUserId: string) {
    // 1. Check if current user is admin OR if we are already impersonating (to allow going back)
    const supabase = await createClient()
    const cookieStore = await cookies()
    const isCurrentlyImpersonating = (await cookieStore).get('rt_impersonating')?.value === 'true'

    let adminId = ''

    if (!isCurrentlyImpersonating) {
        const { data: { user: adminUser } } = await supabase.auth.getUser()
        if (!adminUser) return { error: 'Não autorizado' }
        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', adminUser.id).single()
        if (!profile?.is_admin) return { error: 'Apenas admins podem impersonar usuários' }
        adminId = adminUser.id
    } else {
        adminId = (await cookieStore).get('rt_admin_id')?.value || ''
    }

    // 2. Get target user email
    const { data: targetProfile } = await supabase.from('profiles').select('email, role').eq('id', targetUserId).single()
    if (!targetProfile?.email) return { error: 'Usuário não encontrado ou sem e-mail' }

    // 3. Generate login link using Admin Client
    const admin = createAdminClient()
    if (!admin) return { error: 'Erro de configuração do servidor (Admin SDK)' }

    const { data, error } = await admin.auth.admin.generateLink({
        type: 'magiclink',
        email: targetProfile.email,
        options: { redirectTo: '/' }
    })

    if (error || !data.properties?.email_otp) {
        return { error: `Erro ao gerar link de acesso: ${error?.message || 'Token não gerado'}` }
    }

    // 4. Verify OTP (this signs in the user and sets cookies)
    const { error: verifyError } = await supabase.auth.verifyOtp({
        email: targetProfile.email,
        token: data.properties.email_otp,
        type: 'magiclink'
    })

    if (verifyError) return { error: `Erro ao aplicar sessão: ${verifyError.message}` }

    // 5. Set helper cookies for our ImpersonationBar
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    if (!isCurrentlyImpersonating) {
        (await cookieStore).set('rt_impersonating', 'true', { expires });
        (await cookieStore).set('rt_admin_id', adminId, { expires });
    } else {
        // If we were going back to admin, clear the flags
        const { data: originalAdminProfile } = await supabase.from('profiles').select('is_admin').eq('id', targetUserId).single()
        if (originalAdminProfile?.is_admin) {
            (await cookieStore).delete('rt_impersonating');
            (await cookieStore).delete('rt_admin_id');
        }
    }

    // 6. Redirect to proper dashboard based on role
    if (targetProfile.role === 'trainer') redirect('/dashboard/trainer')
    if (targetProfile.role === 'student') redirect('/dashboard/student')

    redirect('/dashboard')
}

export async function deleteStoreProduct(productId: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('store_products').delete().eq('id', productId)
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'delete_product', target_id: productId })
    revalidatePath('/admin')
    return { success: true }
}

async function uploadImageFromUrl(url: string, prefix: string = 'product') {
    if (!url || !url.startsWith('http') || url.includes('supabase.co')) return url

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const supabase = createAdminClient()
        if (!supabase) throw new Error('Failed to create admin client')

        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg'
        const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

        const { error } = await supabase.storage
            .from('store-products')
            .upload(fileName, buffer, {
                contentType,
                upsert: true
            })

        if (error) {
            // Try to create bucket if it doesn't exist
            if (error.message.includes('not found') || (error as any).status === 404) {
                await supabase.storage.createBucket('store-products', { public: true })
                const { error: retryError } = await supabase.storage
                    .from('store-products')
                    .upload(fileName, buffer, { contentType, upsert: true })
                if (retryError) throw retryError
            } else {
                throw error
            }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('store-products')
            .getPublicUrl(fileName)

        return publicUrl
    } catch (error) {
        console.error('Error uploading image:', error)
        return url // Fallback
    }
}

export async function fetchProductFromUrl(url: string) {
    try {
        console.log(`[Fetch] Starting import for: ${url}`)
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            redirect: 'follow'
        })
        if (!res.ok) throw new Error(`Failed to load URL: ${res.status}`)
        const html = await res.text()
        const finalUrl = res.url
        console.log(`[Fetch] Final URL after redirects: ${finalUrl}`)

        const getMeta = (prop: string) => {
            const regex = new RegExp(`<meta[^>]*(?:property|name|itemprop)=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i')
                || new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${prop}["']`, 'i')
            const match = html.match(regex)
            return match ? match[1] : null
        }

        let title = getMeta('og:title') || getMeta('twitter:title') || (html.match(/<title>([^<]*)<\/title>/i)?.[1]) || ''
        let description = getMeta('og:description') || getMeta('description') || ''
        let image = getMeta('og:image') || getMeta('twitter:image') || ''
        let priceStr = getMeta('product:price:amount') || getMeta('price') || getMeta('twitter:data1')

        // Mercado Livre specific description selectors (to avoid generic store descriptions)
        const mlDescMatch = html.match(/<p class="ui-pdp-description__content">([\s\S]*?)<\/p>/i)
        if (mlDescMatch && mlDescMatch[1].length > 50) {
            description = mlDescMatch[1].trim()
        }

        // Try to find price in standard classes/tags if meta fails
        if (!priceStr) {
            // ML price selectors (fraction + cents)
            const fraction = html.match(/class="andes-money-amount__fraction"[^>]*>([\d.,]+)<\/span>/i)?.[1]
            const cents = html.match(/class="andes-money-amount__cents"[^>]*>(\d+)<\/span>/i)?.[1] || '00'

            if (fraction) {
                priceStr = `${fraction}.${cents}`
            } else {
                // Alternative ML or generic price
                const genPrice = html.match(/itemprop="price" content="([\d.]+)"/i)
                    || html.match(/"price":\s*([\d.]+)/i)
                    || html.match(/R\$\s*([\d.,]+)/i)
                if (genPrice) priceStr = genPrice[1]
            }
        }

        // Rating extraction
        let rating = 0
        let reviews = 0

        // Try to find rating in ARIA labels or visually hidden spans (Common in ML)
        const visuallyHiddenMatch = html.match(/class="andes-visually-hidden">Avaliação\s*([\d.,]+)\s*de\s*5\.\s*([\d.]+)\s*opiniões/i)
            || html.match(/class="andes-visually-hidden">Avaliado com ([\d.,]+)\s*estrelas/i)

        if (visuallyHiddenMatch) {
            rating = parseFloat(visuallyHiddenMatch[1].replace(',', '.'))
            if (visuallyHiddenMatch[2]) {
                reviews = parseInt(visuallyHiddenMatch[2].replace(/\./g, ''))
            }
        }

        if (!rating) {
            const ariaRating = html.match(/aria-label="([\d.,]+)\s*estrelas/i) || html.match(/aria-label="Avaliado com ([\d.,]+)\s*estrelas/i)
            if (ariaRating) rating = parseFloat(ariaRating[1].replace(',', '.'))
        }

        if (!reviews) {
            const ariaReviews = html.match(/aria-label="([\d.]+)\s*opiniões/i) || html.match(/\(([\d.]+)\)\s*opiniões/i)
            if (ariaReviews) reviews = parseInt(ariaReviews[1].replace(/\./g, ''))
        }

        const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)
        if (jsonLdMatch) {
            try {
                const inner = jsonLdMatch[1].trim()
                const json = JSON.parse(inner)
                const product = Array.isArray(json) ? json.find(i => i['@type'] === 'Product') : (json['@type'] === 'Product' ? json : null)
                if (product) {
                    if (product.aggregateRating) {
                        if (!rating) rating = parseFloat(product.aggregateRating.ratingValue || 0)
                        if (!reviews) reviews = parseInt(product.aggregateRating.reviewCount || 0)
                    }
                    if (!priceStr && product.offers?.price) {
                        priceStr = product.offers.price.toString()
                    }
                    if (!image && product.image) {
                        image = Array.isArray(product.image) ? product.image[0] : product.image
                    }
                }
            } catch (e) { }
        }

        // Handle price in title (common in Mercado Livre: "Product Name - R$ 50,00")
        const priceRegex = /R\$\s*([\d.,]+)/i
        const match = title.match(priceRegex)

        if (match) {
            if (!priceStr) priceStr = match[1]
            title = title.replace(match[0], '').trim()
            if (title.endsWith('-')) title = title.substring(0, title.length - 1).trim()
        }

        let price = 0
        if (priceStr) {
            let clean = priceStr.toString().replace(/[^\d.,]/g, '')
            if (clean.includes(',')) {
                if (clean.includes('.')) clean = clean.replace(/\./g, '').replace(',', '.')
                else clean = clean.replace(',', '.')
            }
            price = parseFloat(clean)
        }

        let finalData: any = {
            title: title || '',
            description: description || '',
            image: image || '',
            price: price || 0,
            rating: rating || 0,
            reviews_count: reviews || 0
        }

        // AI Integration
        const openrouterKey = process.env.OPENROUTER_API_KEY
        if (openrouterKey) {
            try {
                const { createOpenRouterClient, callAI, DEFAULT_AI_MODEL } = await import('@/lib/ai-client')
                const client = createOpenRouterClient(openrouterKey)

                // Help AI by identifying the site
                const isML = finalUrl.includes('mercadolivre.com') || finalUrl.includes('meli.la')

                const bodyText = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || html
                const cleanBody = bodyText
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
                    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
                    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
                    .substring(0, 18000)

                const prompt = `
Extract MAIN product information from this HTML from ${isML ? 'Mercado Livre' : 'Store'}.
Site: ${finalUrl}

DATA EXTRACTION RULES:
1. "title": CLEAN product name ONLY. No slogans, seller names, or "Free Shipping".
2. "description": 
   - IGNORE seller metadata like "Visite a página e encontre todos os produtos de...".
   - Extract the ACTUAL product benefits and technical features.
   - Summarize into 2 paragraphs if too long.
3. "price": Find the numeric price (Look for R$, decimals, or meta tags).
4. "rating": Look for "estrelas", "nota" or aggregateRating (0 to 5).
5. "reviews_count": Number of reviews/opinions/avaliacoes.
6. "image": URL of the primary, high-resolution product image.
7. "category": "supplement" | "accessory" | "clothing" | "equipment".
8. "sub_category": If supplement, "Whey" | "Pré-treino" | "Creatina" | "Vitaminas" | "Outros".

HTML Content:
${cleanBody}
`
                const aiResponse = await callAI(client, prompt, DEFAULT_AI_MODEL)
                if (aiResponse && !aiResponse.error) {
                    finalData = {
                        title: aiResponse.title || finalData.title,
                        description: aiResponse.description || finalData.description,
                        image: aiResponse.image || finalData.image,
                        price: aiResponse.price || finalData.price,
                        rating: aiResponse.rating || finalData.rating,
                        reviews_count: aiResponse.reviews_count || finalData.reviews_count,
                        category: aiResponse.category || 'supplement',
                        sub_category: aiResponse.sub_category || ''
                    }
                }
            } catch (aiErr) {
                console.error('AI extraction failed:', aiErr)
            }
        }

        // AUTO UPLOAD IMAGE TO SUPABASE
        if (finalData.image) {
            const uploadedUrl = await uploadImageFromUrl(finalData.image)
            if (uploadedUrl) finalData.image = uploadedUrl
        }

        return finalData
    } catch (e) {
        console.error('Fetch error:', e)
        return { error: 'Falha ao buscar dados. Verifique o link e tente novamente.' }
    }
}

// Operational Costs Actions
export async function addOperationalCost(data: { description: string; amount: number; type: 'fixed' | 'variable' }) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('operational_costs').insert({ ...data, admin_id: adminId })
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'add_cost', details: data })
    revalidatePath('/admin')
    return { success: true }
}

export async function deleteOperationalCost(id: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('operational_costs').delete().eq('id', id)
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'delete_cost', target_id: id })
    revalidatePath('/admin')
    return { success: true }
}

export async function getOperationalCosts() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase.from('operational_costs').select('*').order('created_at', { ascending: false })
    return data || []
}
