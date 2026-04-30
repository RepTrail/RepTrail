'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getGeminiApiKey } from './app-settings-actions'
import { createOpenRouterClient, callAI } from '@/lib/ai-client'

async function checkAdmin() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) throw new Error('Unauthorized')
    return { supabase, userId: user.id }
}

export async function getAdminOverview() {
    const { supabase } = await checkAdmin()

    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

        // Fetch everything in parallel
        const [
            { count: totalTrainers },
            { count: totalStudents },
            { count: totalRelationships },
            { count: countAffiliates },
            { data: affiliateBalances },
            { data: trainers },
            { data: activeStudents },
            { data: autoTrainingStudents },
            { data: studentsData },
            { data: allCommissions },
            { data: allCosts },
            { count: productClicks },
            { count: totalProducts },
            { count: recentSignups }
        ] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'trainer'),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
            supabase.from('trainer_students').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_affiliate', true),
            supabase.from('profiles').select('affiliate_balance').eq('is_affiliate', true),
            supabase.from('profiles').select('id, plan_tier, created_at, elite_until').eq('role', 'trainer'),
            supabase.from('trainer_students').select('student_id, trainer_id').eq('active', true),
            supabase.from('profiles').select('id, created_at').eq('role', 'student').eq('auto_training_status', 'active'),
            supabase.from('trainer_students').select('monthly_fee, active, created_at'),
            supabase.from('affiliate_commissions').select('amount, created_at, status'),
            supabase.from('operational_costs').select('amount, type, created_at'),
            supabase.from('product_clicks').select('*', { count: 'exact', head: true }),
            supabase.from('store_products').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student').gte('created_at', sevenDaysAgo)
        ])

        const affiliateDebt = affiliateBalances?.reduce((acc, curr) => acc + (Number(curr.affiliate_balance) || 0), 0) || 0

        const trainerStudentCounts: Record<string, number> = {}
        activeStudents?.forEach(s => {
            if (s.trainer_id) trainerStudentCounts[s.trainer_id] = (trainerStudentCounts[s.trainer_id] || 0) + 1
        })

        const prices: any = { on_demand: 0 }
        const usageRules: any = { on_demand: { limit: 5, price_per_extra: 10.90 } }

        let monthlySubsRevenue = 0
        let totalSubsRevenue = 0
        let trialCount = 0
        let studentsInTrial = 0

        trainers?.forEach(t => {
            const isTrialActive = t.elite_until && new Date(t.elite_until) > new Date()
            if (isTrialActive) {
                trialCount++
                studentsInTrial += (trainerStudentCounts[t.id] || 0)
                return
            }

            const p = t.plan_tier || 'on_demand'
            const fixedPrice = prices[p] || 0
            let revenue = fixedPrice
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

        const studentAutoTrainingPrice = 10.90
        const monthlyStudentRevenue = (autoTrainingStudents?.length || 0) * studentAutoTrainingPrice
        monthlySubsRevenue += monthlyStudentRevenue

        autoTrainingStudents?.forEach(s => {
            const start = new Date(s.created_at)
            const now = new Date()
            const months = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1)
            totalSubsRevenue += (studentAutoTrainingPrice * months)
        })

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

        const monthlyGrossRevenue = monthlySubsRevenue
        const totalGrossRevenue = totalSubsRevenue

        const totalOperationalCosts = allCosts?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0
        const monthlyOperationalCosts = allCosts?.reduce((acc, curr) => {
            const date = new Date(curr.created_at)
            if (date >= currentMonthStart) return acc + (Number(curr.amount) || 0)
            return acc
        }, 0) || 0

        const monthlyNetProfit = monthlyGrossRevenue - commissionsThisMonth - monthlyOperationalCosts
        const totalNetProfit = totalGrossRevenue - affiliateTotalEarnings - totalOperationalCosts

        const activeTrainersCount = totalTrainers || 0
        const platformTicketPerTrainer = activeTrainersCount > 0 ? (monthlyGrossRevenue / activeTrainersCount) : 0
        const trainerAverageTicket = activeTrainersCount > 0 ? (monthlyTrainerVolume / activeTrainersCount) : 0

        return {
            trainers: totalTrainers || 0,
            trialTrainers: trialCount,
            studentsInTrial,
            students: totalStudents || 0,
            studentsWithTrainer: activeStudents?.length || 0,
            autoTrainingCount: autoTrainingStudents?.length || 0,
            relationships: totalRelationships || 0,
            monthlyTrainerVolume,
            totalTrainerVolume,
            monthlyPlatformProfit: monthlyNetProfit,
            totalPlatformProfit: totalNetProfit,
            monthlyGrossRevenue,
            totalGrossRevenue,
            monthlyOperationalCosts,
            totalOperationalCosts,
            affiliatesCount: countAffiliates || 0,
            affiliateDebt,
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
    let query = supabase.from('profiles').select('id, full_name, email, role, plan_tier, is_admin, created_at, avatar_url, trainer_code, is_billing_exempt, auto_training_status')
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
        const monthlyRevenue = students.reduce((sum: number, s: any) => {
            return s.active ? sum + (Number(s.monthly_fee) || 0) : sum
        }, 0)
        const totalRevenue = students.reduce((sum: number, s: any) => {
            if (!s.active) return sum
            const start = new Date(s.created_at)
            const now = new Date()
            const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
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
        is_billing_exempt: true,
        elite_until: null
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
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'toggle_billing_exempt', target_id: userId, details: { is_billing_exempt: isExempt } })
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
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'grant_elite_trial', target_id: userId, details: { elite_until: eliteUntil.toISOString() } })
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
    const categoryMap: Record<string, string> = {
        'Suplemento': 'supplement',
        'Acessório': 'accessory',
        'Vestuário': 'clothing',
        'Equipamento': 'equipment'
    }
    const finalCategory = categoryMap[data.category] || data.category
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
  return (data || []).map((l: any) => ({
    ...l,
    admin: Array.isArray(l.admin) ? l.admin[0] : l.admin
  }))
}

export async function getTopProductsByClicks() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase
        .from('product_clicks')
        .select('product_id, store_products(name, image_url, category)')
        .limit(100)
    if (!data) return []
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
    const workoutActivities = (workouts.data || []).map(w => ({ ...w, type: 'workout' }))
    const cardioActivities = (cardios.data || []).map(c => ({
        ...c,
        type: 'cardio',
        workout: (c as any).cardio?.cardio
    }))
    return [...workoutActivities, ...cardioActivities]
        .map((a: any) => ({
            ...a,
            student: Array.isArray(a.student) ? a.student[0] : a.student,
            workout: Array.isArray(a.workout) ? a.workout[0] : a.workout
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20)
}

const DEFAULT_PRICES: Record<string, { monthly: number; quarterly_discount: number; annual_discount: number }> = {
    start: { monthly: 49.90, quarterly_discount: 15, annual_discount: 20 },
    pro: { monthly: 149.90, quarterly_discount: 15, annual_discount: 20 },
    elite: { monthly: 299.90, quarterly_discount: 15, annual_discount: 20 },
}

export async function getPlanPricing() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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

    const result: Record<string, any> = {
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

export async function updatePlanPricing(tier: string, monthly: number, quarterlyDiscount: number, annualDiscount: number, extras?: any) {
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
    if (error) return { success: false, error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'update_plan_pricing', details: { tier, monthly, quarterlyDiscount, annualDiscount, extras } })
    revalidatePath('/admin')
    revalidatePath('/dashboard/trainer/plans')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const admin = createAdminClient()
    try {
        // 1. STORAGE CLEANUP
        // Avatar
        const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', userId).maybeSingle()
        if (profile?.avatar_url) {
            const avatarPath = profile.avatar_url.split('/').slice(-2).join('/')
            if (avatarPath) await supabase.storage.from('avatars').remove([avatarPath])
        }
        
        // Progress Photos
        const { data: progressPhotos } = await supabase.from('progress_photos').select('front_url, back_url, side_left_url, side_right_url').eq('student_id', userId)
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
            if (photoPaths.length > 0) await supabase.storage.from('progress-photos').remove(photoPaths)
        }

        // PDF Uploads
        const { data: pdfUploads } = await supabase.from('pdf_uploads').select('file_url').eq('uploader_id', userId)
        if (pdfUploads) {
            const pdfPaths: string[] = []
            pdfUploads.forEach(pdf => {
                if (pdf.file_url) {
                    const path = pdf.file_url.split('/').slice(-2).join('/')
                    if (path) pdfPaths.push(path)
                }
            })
            if (pdfPaths.length > 0) await supabase.storage.from('pdf-uploads').remove(pdfPaths)
        }

        // 2. DATABASE CLEANUP (Child tables first to satisfy constraints)
        
        // User Activity & Logs
        await supabase.from('workout_logs').delete().eq('student_id', userId)
        await supabase.from('cardio_logs').delete().eq('student_id', userId)
        await supabase.from('cardio_sessions').delete().eq('student_id', userId)
        await supabase.from('ergogenic_logs').delete().eq('student_id', userId)
        await supabase.from('meal_item_logs').delete().eq('user_id', userId)
        await supabase.from('daily_tracking').delete().eq('user_id', userId)
        
        // History & Metrics
        await supabase.from('weight_history').delete().eq('student_id', userId)
        await supabase.from('bf_history').delete().eq('student_id', userId)
        await supabase.from('metrics_summary').delete().eq('student_id', userId)
        await supabase.from('progress_photos').delete().eq('student_id', userId)
        await supabase.from('ai_protocol_status').delete().eq('student_id', userId)
        
        // Assignments & Relationships
        await supabase.from('assigned_workouts').delete().eq('student_id', userId)
        await supabase.from('assigned_diets').delete().eq('student_id', userId)
        await supabase.from('assigned_cardios').delete().eq('student_id', userId)
        await supabase.from('assigned_ergogenics').delete().eq('student_id', userId)
        await supabase.from('trainer_students').delete().or(`student_id.eq.${userId},trainer_id.eq.${userId}`)
        await supabase.from('trainer_reviews').delete().or(`student_id.eq.${userId},trainer_id.eq.${userId}`)
        
        // Trainer Libraries (Workouts depend on these, so we delete them after logs)
        await supabase.from('workouts').delete().eq('trainer_id', userId)
        await supabase.from('diets').delete().eq('trainer_id', userId)
        await supabase.from('cardios').delete().eq('trainer_id', userId)
        await supabase.from('ergogenics').delete().eq('trainer_id', userId)
        await supabase.from('exercises').delete().eq('trainer_id', userId)
        
        // Metadata & Misc
        await supabase.from('notifications').delete().eq('user_id', userId)
        await supabase.from('outbox').delete().eq('user_id', userId)
        await supabase.from('pdf_uploads').delete().eq('uploader_id', userId)
        await supabase.from('student_details').delete().eq('id', userId)
        await supabase.from('product_clicks').delete().eq('user_id', userId)
        
        // 3. FINAL LOGGING AND DELETION
        await supabase.from('admin_logs').insert({ 
            admin_id: adminId, 
            action: 'delete_user', 
            target_id: userId, 
            details: { deleted_at: new Date().toISOString(), type: 'hard_delete' } 
        })
        
        // Delete from profiles (last DB step)
        const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId)
        if (profileError) {
            console.error('Profile deletion error:', profileError)
            return { error: `Erro ao deletar perfil: ${profileError.message}` }
        }
        
        // Delete from auth.users (requires service role)
        if (!admin) {
            return { success: true, warning: 'Dados removidos do banco, mas o login Auth não pôde ser excluído (Configuração de Admin ausente).' }
        }
        
        const { error: authError } = await admin.auth.admin.deleteUser(userId)
        if (authError) {
            console.warn('Auth deletion error:', authError)
            return { success: true, warning: `Dados apagados do banco, mas houve erro ao remover conta de login: ${authError.message}` }
        }
        
        revalidatePath('/admin')
        return { success: true }
    } catch (e: any) {
        console.error('Delete User Hard Crash:', e)
        return { error: `Erro inesperado durante a exclusão: ${e.message}` }
    }
}

export async function updateStoreProduct(id: string, data: any) {
    const { supabase, userId: adminId } = await checkAdmin()
    const categoryMap: Record<string, string> = { 'Suplemento': 'supplement', 'Acessório': 'accessory', 'Vestuário': 'clothing', 'Equipamento': 'equipment' }
    if (data.category && categoryMap[data.category]) data.category = categoryMap[data.category]
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const cookieStore = await cookies()
    const isCurrentlyImpersonating = cookieStore.get('rt_impersonating')?.value === 'true'
    let adminId = ''
    if (!isCurrentlyImpersonating) {
        const { data: { user: adminUser } } = await supabase.auth.getUser()
        if (!adminUser) return { error: 'Não autorizado' }
        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', adminUser.id).single()
        if (!profile?.is_admin) return { error: 'Apenas admins podem impersonar usuários' }
        adminId = adminUser.id
    } else {
        adminId = cookieStore.get('rt_admin_id')?.value || ''
    }
    const { data: targetProfile } = await supabase.from('profiles').select('email, role').eq('id', targetUserId).single()
    if (!targetProfile?.email) return { error: 'Usuário não encontrado' }
    const admin = createAdminClient()
    if (!admin) return { error: 'Erro de configuração do servidor' }
    const { data, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email: targetProfile.email, options: { redirectTo: '/' } })
    if (error || !data.properties?.email_otp) return { error: 'Erro ao gerar link' }
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: targetProfile.email, token: data.properties.email_otp, type: 'magiclink' })
    if (verifyError) return { error: verifyError.message }
    const expires = new Date(Date.now() + 60 * 60 * 1000)
    if (!isCurrentlyImpersonating) {
        cookieStore.set('rt_impersonating', 'true', { expires })
        cookieStore.set('rt_admin_id', adminId, { expires })
    } else {
        const { data: originalAdminProfile } = await supabase.from('profiles').select('is_admin').eq('id', targetUserId).single()
        if (originalAdminProfile?.is_admin) {
            cookieStore.delete('rt_impersonating')
            cookieStore.delete('rt_admin_id')
        }
    }
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
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        if (!response.ok) throw new Error('Fetch failed')
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const supabase = createAdminClient()
        if (!supabase) throw new Error('No admin client')
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg'
        const fileName = `${prefix}-${Date.now()}.${ext}`
        const { data, error } = await supabase.storage.from('store-products').upload(fileName, buffer, { contentType, cacheControl: '3600', upsert: true })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('store-products').getPublicUrl(fileName)
        return publicUrl
    } catch (e) {
        console.error('Upload error:', e)
        return url
    }
}

export async function fetchProductFromUrl(url: string) {
    const { supabase } = await checkAdmin()
    try {
        console.log('[SCRAPER] Fetching URL:', url)
        const response = await fetch(url, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
            } 
        })
        const html = await response.text()
        
        // 1. Try to extract basic meta tags as fallback
        const getMeta = (prop: string) => {
            const match = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
                html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i')) ||
                html.match(new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
            return match ? match[1] : null
        }

        const fallbackTitle = getMeta('og:title') || html.match(/<title>([^<]+)<\/title>/i)?.[1] || ''
        const fallbackDescription = getMeta('og:description') || getMeta('description') || ''
        const fallbackImage = getMeta('og:image') || ''
        let fallbackPrice = 0
        const priceMatch = html.match(/R\$\s?([0-9.,]+)/i)
        if (priceMatch) fallbackPrice = parseFloat(priceMatch[1].replace('.', '').replace(',', '.'))

        // Advanced Regex for ML Rating/Reviews if JSON-LD is hidden
        let ratingMatch = html.match(/class=["']ui-pdp-review__rating["']>([\d.]+)<\/span>/i) || 
                          html.match(/(\d\.\d)\s*estrela/i) || 
                          html.match(/nota:\s*(\d\.\d)/i)
        let fallbackRating = ratingMatch ? parseFloat(ratingMatch[1]) : 0
        
        let reviewMatch = html.match(/\((\d+)\)\s*(?:opin|avalia)/i) || html.match(/(\d+)\s*(?:opin|avalia)/i)
        let fallbackReviews = reviewMatch ? parseInt(reviewMatch[1]) : 0

        // 1.5 Try to extract JSON-LD for rating/reviews/better info
        let jsonLdData: any = {}
        const jsonLdMatch = html.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i)
        if (jsonLdMatch) {
            try {
                const parsed = JSON.parse(jsonLdMatch[1])
                const product = Array.isArray(parsed) ? parsed.find(i => i['@type'] === 'Product') : (parsed['@type'] === 'Product' ? parsed : null)
                if (product) {
                    jsonLdData = {
                        title: product.name,
                        image: Array.isArray(product.image) ? product.image[0] : product.image,
                        price: product.offers?.price || product.offers?.[0]?.price,
                        rating: product.aggregateRating?.ratingValue,
                        reviews_count: product.aggregateRating?.reviewCount,
                        description: product.description
                    }
                }
            } catch (e) {}
        }

        let finalData: any = { 
            title: jsonLdData.title || fallbackTitle, 
            description: (jsonLdData.description || fallbackDescription).substring(0, 150), 
            image: jsonLdData.image || fallbackImage, 
            price: jsonLdData.price || fallbackPrice, 
            rating: jsonLdData.rating || fallbackRating || 0,
            reviews_count: jsonLdData.reviews_count || fallbackReviews || 0,
            link_url: url 
        }

        // 2. Try IA if key is available
        const geminiKey = await getGeminiApiKey()
        if (geminiKey) {
            console.log('[SCRAPER] Key found, using Gemini...')
            try {
                const cleanHtml = html
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                    .substring(0, 30000) 

                const client = createOpenRouterClient(geminiKey)
                const prompt = `
                    Você é um extrator de dados de e-commerce. 
                    Analise o HTML abaixo e retorne APENAS um JSON com os seguintes campos:
                    {
                        "title": "nome completo do produto",
                        "description": "descrição curta (máximo 150 caracteres)",
                        "image": "url da imagem principal",
                        "price": 99.99,
                        "rating": 4.5,
                        "reviews_count": 120,
                        "category": "supplement" | "accessory" | "clothing" | "equipment",
                        "sub_category": "Whey" | "Pré-treino" | "Vitaminas" | "Outros" | ""
                    }

                    HTML:
                    ${cleanHtml}
                `
                const aiData = await callAI(client, prompt)
                finalData = { ...finalData, ...aiData }
            } catch (aiError) {
                console.error('[SCRAPER] Gemini failed:', aiError)
            }
        }

        // 3. SECURE IMAGE (Download to Bucket)
        if (finalData.image && finalData.image.startsWith('http')) {
            console.log('[SCRAPER] Uploading image to bucket:', finalData.image)
            const bucketUrl = await uploadImageFromUrl(finalData.image).catch(err => {
                console.error('[SCRAPER] Bucket upload failed. Check if "store-products" bucket exists in Supabase Dashboard.', err)
                return null
            })
            if (bucketUrl) finalData.image = bucketUrl
        }

        return { ...finalData, link_url: url }
    } catch (e) {
        console.error('[SCRAPER] Fatal error:', e)
        return { title: '', description: '', image: '', price: 0, link_url: url }
    }
}

export async function addOperationalCost(data: { description: string; amount: number; type: 'fixed' | 'variable' }) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('operational_costs').insert(data)
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

export async function deleteOperationalCost(id: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('operational_costs').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

export async function getOperationalCosts() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase.from('operational_costs').select('*').order('created_at', { ascending: false })
    return data || []
}

export async function repairWorkoutExercisesData() {
    const { supabase, userId: adminId } = await checkAdmin()

    try {
        console.log('[REPAIR] Starting workout_exercises data cleanup...')

        // 1. Fetch all exercises that might need cleaning
        const { data: exercises, error: fetchErr } = await supabase
            .from('workout_exercises')
            .select('id, reps, warmup_reps, feeder_reps')
            .or('reps.ilike.%movimento%,reps.ilike.%serie%,warmup_reps.ilike.%movimento%,warmup_reps.ilike.%serie%,feeder_reps.ilike.%movimento%,feeder_reps.ilike.%serie%')

        if (fetchErr) throw fetchErr
        if (!exercises || exercises.length === 0) {
            return { success: true, message: 'Nenhum exercício precisa de reparo.' }
        }

        console.log(`[REPAIR] Found ${exercises.length} exercises to potentially repair.`)

        const cleanValue = (val: string | null) => {
            if (!val) return val
            let s = val.trim()

            // Pattern: "1 a 2 series de 10 Movimentos" or "3x10 reps" or "series de 10"
            // We want to capture the last part which is usually the reps
            const complexPattern = s.match(/(?:\d+.*series?|series?.*de|x)\s*(\d+(?:\s*[-–a/]\s*\d+)?)\b/i)
            if (complexPattern) {
                return complexPattern[1].replace(/\s+/g, '').replace(/a|[-–/]/g, '-').trim()
            }

            // Pattern: "10 Movimentos" or "10 reps" (simple)
            const simplePattern = s.match(/^(\d+(?:\s*[-–a/]\s*\d+)?)\s*(?:movimentos|reps?|repetições|repeticoes)/i)
            if (simplePattern) {
                return simplePattern[1].replace(/\s+/g, '').replace(/a|[-–/]/g, '-').trim()
            }

            // Final fallback: if "series" is in the text and there are multiple numbers, take the last one
            if (/serie/i.test(s)) {
                const numbers = s.match(/\d+/g)
                if (numbers && numbers.length > 1) {
                    return numbers[numbers.length - 1]
                }
            }

            return s
        }

        let updatedCount = 0
        const updatePromises = exercises.map(async (ex) => {
            const nextReps = cleanValue(ex.reps)
            const nextWarmup = cleanValue(ex.warmup_reps)
            const nextFeeder = cleanValue(ex.feeder_reps)

            if (nextReps !== ex.reps || nextWarmup !== ex.warmup_reps || nextFeeder !== ex.feeder_reps) {
                const { error } = await supabase
                    .from('workout_exercises')
                    .update({
                        reps: nextReps,
                        warmup_reps: nextWarmup,
                        feeder_reps: nextFeeder
                    })
                    .eq('id', ex.id)

                if (!error) updatedCount++
                return !error
            }
            return false
        })

        await Promise.all(updatePromises)

        await supabase.from('admin_logs').insert({
            admin_id: adminId,
            action: 'repair_workout_data',
            details: { repaired_count: updatedCount }
        })

        return { success: true, message: `${updatedCount} exercícios foram limpos com sucesso.` }

    } catch (e: any) {
        console.error('[REPAIR] Failed:', e)
        return { error: e.message }
    }
}

export async function repairBiSets() {
    const { supabase, userId: adminId } = await checkAdmin()
    const stats = { structureFixed: 0, historyFixed: 0 }

    try {
        console.log('[REPAIR] Starting Bi-set structure repair...')

        // 1. IMPROVE STRUCTURE: Merge sequential 0-rest exercises
        const { data: workouts } = await supabase.from('workouts').select('id')
        if (workouts) {
            for (const w of workouts) {
                const { data: exes } = await supabase
                    .from('workout_exercises')
                    .select('*, exercise:exercises(name, id)')
                    .eq('workout_id', w.id)
                    .order('order_index', { ascending: true })

                if (!exes || exes.length < 2) continue

                const groupsToMerge: any[][] = []
                let currentBatch: any[] = []

                for (let i = 0; i < exes.length; i++) {
                    currentBatch.push(exes[i])
                    // If rest is 0 and not last, it's a candidate for merge
                    if (i < exes.length - 1 && (exes[i].rest_seconds === 0 || exes[i].rest_seconds === null)) {
                        continue
                    } else if (currentBatch.length > 1) {
                        groupsToMerge.push([...currentBatch])
                        currentBatch = []
                    } else {
                        currentBatch = []
                    }
                }

                for (const group of groupsToMerge) {
                    const first = group[0]
                    const last = group[group.length - 1]
                    const combinedName = group.map(g => g.exercise?.name || 'Exercício').join(' + ')

                    // Find or Create a Template for this Bi-Set
                    const { data: existingTemplate } = await supabase
                        .from('exercises')
                        .select('id')
                        .eq('name', combinedName)
                        .maybeSingle()

                    let templateId = existingTemplate?.id

                    if (!templateId) {
                        const { data: newT } = await supabase
                            .from('exercises')
                            .insert({
                                name: combinedName,
                                trainer_id: first.exercise?.trainer_id || null,
                                is_system_default: false
                            })
                            .select('id')
                            .single()
                        templateId = newT?.id
                    }

                    if (templateId) {
                        // Merge them into the first record
                        await supabase.from('workout_exercises').update({
                            exercise_id: templateId,
                            rest_seconds: last.rest_seconds,
                            working_sets: first.working_sets,
                            reps: first.reps
                        }).eq('id', first.id)

                        // Delete the others
                        const toDelete = group.slice(1).map(g => g.id)
                        await supabase.from('workout_exercises').delete().in('id', toDelete)
                        stats.structureFixed++
                    }
                }
            }
        }

        // 2. IMPROVE HISTORY: Backfill markers for existing bi-sets
        console.log('[REPAIR] Starting Bi-set history backfill...')
        const { data: history } = await supabase
            .from('load_history')
            .select('*, exercise:exercises(name)')
            .is('sub_index', null)
            .ilike('exercises.name', '%+%')

        if (history) {
            // Group by log and exercise to detect sequences
            const groups = history.reduce((acc, item) => {
                const key = `${item.workout_log_id}-${item.exercise_id}`
                if (!acc[key]) acc[key] = []
                acc[key].push(item)
                return acc
            }, {} as Record<string, any[]>)

            for (const key in groups) {
                const sets = groups[key]
                const exerciseName = sets[0].exercise?.name || ''
                const parts = exerciseName.split(/\s*\+\s*/).map((p: string) => p.trim())

                if (parts.length > 1) {
                    // Try to distribute sets.
                    // If we have 6 sets and 2 parts, assume 1A, 1B, 2A, 2B, 3A, 3B
                    // Actually, often in old logs they are just sequential A, A, A...
                    // But if there are multiple parts, let's just tag them with at least indices.
                    for (let i = 0; i < sets.length; i++) {
                        const partIdx = i % parts.length
                        await supabase.from('load_history').update({
                            sub_index: partIdx,
                            notes: `[${parts[partIdx]}] ${sets[i].notes || ''}`.trim()
                        }).eq('id', sets[i].id)
                        stats.historyFixed++
                    }
                }
            }
        }

        await supabase.from('admin_logs').insert({
            admin_id: adminId,
            action: 'repair_bisets',
            details: stats
        })

        return { success: true, message: `Reparo concluído! ${stats.structureFixed} bi-sets estruturados e ${stats.historyFixed} registros de histórico corrigidos.` }

    } catch (e: any) {
        console.error('[REPAIR BISETS] Failed:', e)
        return { error: e.message }
    }
}

export async function grantAutoTraining(studentId: string, status: 'active' | 'none') {
    const { supabase } = await checkAdmin()
    
    const { error } = await supabase
        .from('profiles')
        .update({ 
            auto_training_status: status,
        })
        .eq('id', studentId)
    
    if (error) {
        console.error('[GRANT AUTO TRAINING] Failed:', error)
        return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('admin_logs').insert({
            admin_id: user.id,
            action: 'grant_auto_training',
            details: { student_id: studentId, status }
        })
    }

    revalidatePath('/admin')
    return { success: true }
}
