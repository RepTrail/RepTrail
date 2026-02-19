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

        const prices: any = { start: 49.90, pro: 149.90, elite: 299.90, on_demand: 0 }
        const usageRules: any = { on_demand: { limit: 5, price_per_extra: 20 } } // Default logic

        let monthlySubsRevenue = 0
        let totalSubsRevenue = 0
        let trialCount = 0
        let studentsInTrial = 0

        console.log('--- Admin Revenue Calc ---')

        trainers?.forEach(t => {
            // Check for active trial
            const isTrialActive = t.elite_until && new Date(t.elite_until) > new Date()

            console.log(`Trainer ${t.id} (${t.plan_tier}) | EliteUntil: ${t.elite_until} | Trial: ${isTrialActive}`)

            // If trial is active, subscription revenue is 0
            if (isTrialActive) {
                trialCount++
                studentsInTrial += (trainerStudentCounts[t.id] || 0)
                return
            }

            const p = t.plan_tier || 'on_demand' // Default is On Demand (Free fixed cost)
            const fixedPrice = prices[p] || 0

            let revenue = fixedPrice

            // If On Demand, add usage fee
            if (p === 'on_demand') {
                const count = trainerStudentCounts[t.id] || 0
                const { limit, price_per_extra } = usageRules.on_demand
                if (count > limit) {
                    revenue += (count - limit) * price_per_extra
                }
            }

            monthlySubsRevenue += revenue

            // Estimate lifetime subs (rough estimate assuming current plan was always the plan)
            const start = new Date(t.created_at)
            const now = new Date()
            const months = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1)
            totalSubsRevenue += (revenue * months)
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

        const { count: productClicks } = await supabase.from('product_click_logs').select('*', { count: 'exact', head: true })
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
    let query = supabase.from('profiles').select('id, full_name, email, role, plan_tier, is_admin, created_at, avatar_url, trainer_code')
    if (role) query = query.eq('role', role)
    const { data } = await query.order('created_at', { ascending: false })
    return data || []
}

export async function getAllTrainers() {
    const { supabase } = await checkAdmin()
    const { data } = await supabase
        .from('profiles')
        .select(`
            id, full_name, email, plan_tier, average_rating, total_reviews, is_elite, created_at, avatar_url, trainer_code, specialty, region,
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
    rating?: number
    reviews_count?: number
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
    const { error } = await supabase.from('store_products').update(data).eq('id', id)
    if (error) return { error: 400 } // using generic error for now
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'update_product', target_id: id, details: data })
    revalidatePath('/admin')
    return { success: true }
}

export async function deleteStoreProduct(productId: string) {
    const { supabase, userId: adminId } = await checkAdmin()
    const { error } = await supabase.from('store_products').delete().eq('id', productId)
    if (error) return { error: error.message }
    await supabase.from('admin_logs').insert({ admin_id: adminId, action: 'delete_product', target_id: productId })
    revalidatePath('/admin')
    return { success: true }
}

export async function fetchProductFromUrl(url: string) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
        if (!res.ok) throw new Error('Failed to load URL')
        const html = await res.text()

        const getMeta = (prop: string) => {
            const match = html.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`, 'i'))
                || html.match(new RegExp(`<meta name="${prop}" content="([^"]*)"`, 'i'))
            return match ? match[1] : null
        }

        let title = getMeta('og:title') || (html.match(/<title>([^<]*)<\/title>/i)?.[1]) || ''
        const description = getMeta('og:description') || getMeta('description') || ''
        const image = getMeta('og:image') || ''
        let priceStr = getMeta('product:price:amount') || getMeta('price')

        // Handle price in title (common in Mercado Livre: "Product Name - R$ 50,00")
        const priceRegex = /R\$\s*([\d.,]+)/i
        const match = title.match(priceRegex)

        if (match) {
            // If no meta price, use the one from title
            if (!priceStr) {
                priceStr = match[1]
            }
            // Remove price from title for cleaner name
            title = title.replace(match[0], '').trim()
            if (title.endsWith('-')) title = title.substring(0, title.length - 1).trim()
        }

        let price = 0
        if (priceStr) {
            let clean = priceStr.replace(/[^\d.,]/g, '')
            if (clean.includes(',')) {
                // Assume 1.000,00 format
                clean = clean.replace(/\./g, '').replace(',', '.')
            }
            price = parseFloat(clean)
        }

        // Rating extraction
        let rating = 0
        let reviews = 0

        // Try to find JSON-LD
        const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)
        if (jsonLdMatch) {
            try {
                const inner = jsonLdMatch[1].trim()
                const json = JSON.parse(inner)
                // It might be an array or object
                const product = Array.isArray(json) ? json.find(i => i['@type'] === 'Product') : (json['@type'] === 'Product' ? json : null)

                if (product?.aggregateRating) {
                    rating = parseFloat(product.aggregateRating.ratingValue || 0)
                    reviews = parseInt(product.aggregateRating.reviewCount || 0)
                }
            } catch (e) {
                // ignore json parse error
            }
        }

        // Fallback 
        if (!rating) {
            const ratingMatch = html.match(/"ratingValue":"([\d.]+)"/i) || html.match(/itemprop="ratingValue" content="([\d.]+)"/i)
            if (ratingMatch) rating = parseFloat(ratingMatch[1])

            const reviewMatch = html.match(/"reviewCount":"(\d+)"/i) || html.match(/itemprop="reviewCount" content="(\d+)"/i)
            if (reviewMatch) reviews = parseInt(reviewMatch[1])
        }

        return {
            title: title || '',
            description: description || '',
            image: image || '',
            price: price || 0,
            rating: rating || 0,
            reviews_count: reviews || 0
        }
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
