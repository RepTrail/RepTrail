'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

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

        const { data: revenueData } = await supabase.from('trainer_students').select('monthly_fee')
        const totalRevenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.monthly_fee) || 0), 0) || 0
        const platformTax = totalRevenue * 0.05

        const { count: productClicks } = await supabase.from('product_click_logs').select('*', { count: 'exact', head: true })
        const { count: totalProducts } = await supabase.from('store_products').select('*', { count: 'exact', head: true }).eq('is_active', true)

        // Recent signups (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        const { count: recentSignups } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo)

        return {
            trainers: totalTrainers || 0,
            students: totalStudents || 0,
            relationships: totalRelationships || 0,
            revenue: totalRevenue,
            tax: platformTax,
            productClicks: productClicks || 0,
            totalProducts: totalProducts || 0,
            recentSignups: recentSignups || 0,
        }
    } catch (e) {
        console.error('Admin overview error:', e)
        return null
    }
}

export async function getAllUsers(role?: string) {
    const { supabase } = await checkAdmin()
    let query = supabase.from('profiles').select('id, full_name, email, role, plan_tier, is_admin, created_at, avatar_url, trainer_code')
    if (role) query = query.eq('role', role)
    const { data } = await query.order('created_at', { ascending: false })
    return data || []
}

export async function getAllTrainers() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, plan_tier, average_rating, total_reviews, is_elite, created_at, avatar_url, trainer_code, specialty, region')
        .eq('role', 'trainer')
        .order('created_at', { ascending: false })
    return data || []
}

export async function updateUserPlanTier(userId: string, planTier: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('profiles').update({
        plan_tier: planTier,
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
}) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('store_products').insert({ ...data, is_active: true })
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'add_product', details: data })
    revalidatePath('/admin')
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
        .from('product_click_logs')
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
    const { data } = await supabase
        .from('workout_logs')
        .select(`
            id,
            created_at,
            status,
            student:profiles!student_id(full_name, avatar_url),
            workout:workouts(name)
        `)
        .order('created_at', { ascending: false })
        .limit(20)
    return data || []
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
            console.warn('SUPABASE_SERVICE_ROLE_KEY não configurada. Dados deletados, mas usuário ainda existe no auth.')
            revalidatePath('/admin')
            return {
                success: true,
                warning: 'Dados deletados com sucesso, mas o usuário ainda existe no auth. Configure SUPABASE_SERVICE_ROLE_KEY no .env.local para deletar completamente.'
            }
        }

        const { error: authError } = await admin.auth.admin.deleteUser(userId)

        if (authError) {
            console.error('Erro ao deletar usuário do auth:', authError)
            return { error: `Erro ao deletar autenticação: ${authError.message}` }
        }

        revalidatePath('/admin')
        return { success: true }
    } catch (e: any) {
        console.error('Erro ao deletar usuário:', e)
        return { error: e.message || 'Erro desconhecido ao deletar usuário' }
    }
}
