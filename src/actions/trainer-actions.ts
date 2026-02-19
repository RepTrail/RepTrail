'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ActivityItem = {
    id: string
    type: 'workout' | 'meal' | 'cardio' | 'weight' | 'photo'
    studentName: string
    studentAvatar: string | null
    contentName: string
    timestamp: string
    status: string
}

export async function updateTrainerProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const trainerCode = formData.get('trainer_code')?.toString().toUpperCase().trim()
    const fullName = formData.get('full_name')?.toString().trim()
    const avatarUrl = formData.get('avatar_url')?.toString().trim()
    const whatsapp = formData.get('whatsapp')?.toString().trim()
    const instagram = formData.get('instagram')?.toString().trim()
    const cref = formData.get('cref')?.toString().trim()
    const location = formData.get('location')?.toString().trim()
    const bio = formData.get('bio')?.toString().trim()
    const specialties = formData.get('specialties')?.toString().split(',').map(s => s.trim()).filter(Boolean)

    if (!trainerCode) return { error: 'Trainer Code is required' }

    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                trainer_code: trainerCode,
                full_name: fullName,
                avatar_url: avatarUrl,
                whatsapp: whatsapp,
                instagram: instagram,
                cref: cref,
                location: location,
                bio: bio,
                specialties: specialties,
            })
            .eq('id', user.id)

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { error: 'Este código já está em uso. Escolha outro.' }
            }
            throw error
        }

        revalidatePath('/dashboard/trainer/profile')
        revalidatePath('/dashboard/trainer/ranking')
        revalidatePath('/dashboard', 'layout')
        return { success: true }

    } catch (e: any) {
        return { error: 'Failed to update profile: ' + e.message }
    }
}

export async function uploadTrainerAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    try {
        const file = formData.get('file') as File
        if (!file) throw new Error('No file provided')

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id)

        if (profileError) throw profileError

        revalidatePath('/dashboard/trainer/profile')
        revalidatePath('/dashboard', 'layout')

        return { success: true, url: publicUrl }
    } catch (e: any) {
        console.error('Error uploading trainer avatar:', e)
        return { success: false, error: e.message }
    }
}

export async function getTrainerProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return data
}

export async function createStudent(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Unauthorized' }

    const email = formData.get('email')?.toString().trim().toLowerCase()
    const monthlyFee = parseFloat(formData.get('monthlyFee')?.toString() || '0')

    if (!email) return { success: false, message: 'Email is required' }

    try {
        // 1. Find Student by Email
        const { data: student, error: fetchError } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('email', email)
            .single()

        if (fetchError || !student) {
            return { success: false, message: 'Aluno não encontrado. Peça para ele criar uma conta no RepTrail primeiro.' }
        }

        if (student.role === 'trainer') {
            return { success: false, message: 'Este email pertence a um treinador, não a um aluno.' }
        }

        // 2. Link Student to Trainer
        const { error: linkError } = await supabase
            .from('trainer_students')
            .insert({
                trainer_id: user.id,
                student_id: student.id,
                monthly_fee: monthlyFee,
                active: true,
                billing_source: 'manual'
            })

        if (linkError) {
            if (linkError.code === '23505') { // Unique violation
                return { success: false, message: 'Este aluno já está vinculado a você.' }
            }
            throw linkError
        }

        revalidatePath('/dashboard/trainer/students')
        revalidatePath('/dashboard/trainer/ranking')
        return { success: true, message: 'Aluno vinculado com sucesso!' }

    } catch (e: any) {
        console.error(e)
        return { success: false, message: 'Erro ao vincular aluno: ' + e.message }
    }
}

export async function getTrainerStudents() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from('trainer_students')
        .select(`
            id,
            student_id,
            student:profiles!student_id(full_name, email)
        `)
        .eq('trainer_id', user.id)
        .eq('active', true)

    return data || []
}
export async function getTrainerRanking() {
    const supabase = await createClient()

    try {
        // Use direct query like getStudentTrainer to ensure trainer_code is properly fetched
        const { data: trainers, error } = await supabase
            .from('profiles')
            .select(`
                id,
                full_name,
                trainer_code,
                avatar_url,
                plan_tier,
                average_rating,
                specialties
            `)
            .eq('role', 'trainer')

        if (error) {
            console.error('Error fetching trainers:', error)
            return []
        }

        if (!trainers) return []

        // Get student counts for each trainer
        const trainerIds = trainers.map(t => t.id)
        const { data: studentCounts } = await supabase
            .from('trainer_students')
            .select('trainer_id')
            .in('trainer_id', trainerIds)
            .eq('active', true)

        // Create a map of trainer_id -> student_count
        const studentCountMap = new Map<string, number>()
        studentCounts?.forEach(sc => {
            const current = studentCountMap.get(sc.trainer_id) || 0
            studentCountMap.set(sc.trainer_id, current + 1)
        })

        // Calculate scores
        const tierPoints: Record<string, number> = {
            'start': 0,
            'on_demand': 50, // On Demand gives baseline 50 points
            'pro': 100,
            'elite': 500
        }

        const ranking = trainers.map((t: any) => {
            const studentCount = studentCountMap.get(t.id) || 0
            const rating = Number(t.average_rating || 0)
            let tier = (t.plan_tier || 'on_demand').toLowerCase()

            // Dynamic Tier Logic for On Demand
            if (tier === 'on_demand' && studentCount >= 50) {
                tier = 'elite' // Grant Elite status visually and for score if they hit 50 students
            }

            const tierPt = tierPoints[tier] || 0

            // Ensure score is always a number
            const score = tierPt + (studentCount * 5) + (rating * 20)

            return {
                id: t.id,
                full_name: t.full_name || 'Treinador sem nome',
                avatar_url: t.avatar_url,
                plan_tier: tier,
                rating: isNaN(rating) ? 0 : rating,
                specialties: t.specialties || [],
                studentCount,
                score: isNaN(score) ? 0 : score,
                trainer_code: t.trainer_code ? String(t.trainer_code).trim().toUpperCase() : null
            }
        })

        // Sort by score and limit to 500
        return ranking
            .sort((a: any, b: any) => b.score - a.score)
            .slice(0, 500)
    } catch (e) {
        console.error('Unexpected error in getTrainerRanking:', e)
        return []
    }
}

export async function updateTrainerPlan(tier: 'start' | 'pro' | 'elite') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Unauthorized' }

    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                plan_tier: tier,
                elite_until: null // Clear trial status when manually picking a plan
            })
            .eq('id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/trainer')
        revalidatePath('/dashboard/trainer/plans')
        revalidatePath('/dashboard/trainer/ranking')

        return { success: true, message: `Plano atualizado para ${tier.toUpperCase()} com sucesso!` }
    } catch (e: any) {
        console.error('Error updating trainer plan:', e)
        return { success: false, message: 'Erro ao atualizar plano: ' + e.message }
    }
}

export async function getTrainerTier(): Promise<'none' | 'start' | 'on_demand' | 'pro' | 'elite'> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 'none'

    const { data } = await supabase
        .from('profiles')
        .select('plan_tier')
        .eq('id', user.id)
        .single()

    return (data?.plan_tier as 'none' | 'on_demand' | 'start' | 'pro' | 'elite') || 'on_demand'
}

export async function getEffectiveTier(): Promise<'none' | 'start' | 'on_demand' | 'pro' | 'elite'> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'none'

    const { data: profile } = await supabase
        .from('profiles')
        .select('plan_tier')
        .eq('id', user.id)
        .single()

    const tier = (profile?.plan_tier as 'none' | 'on_demand' | 'start' | 'pro' | 'elite') || 'on_demand'

    if (tier === 'on_demand') {
        const { count } = await supabase
            .from('trainer_students')
            .select('*', { count: 'exact', head: true })
            .eq('trainer_id', user.id)
            .eq('active', true)

        if ((count || 0) >= 8) return 'pro'
    }

    return tier
}

export async function getTrainerActivityFeed(): Promise<ActivityItem[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    try {
        // 1. Get trainer's student IDs
        const { data: students } = await supabase
            .from('trainer_students')
            .select('student_id')
            .eq('trainer_id', user.id)
            .eq('active', true)

        if (!students || students.length === 0) return []
        const studentIds = students.map(s => s.student_id)

        // 2. Fetch latest logs from all sources
        const [workoutsRes, mealsRes, cardiosRes, weightRes, photosRes] = await Promise.all([
            supabase
                .from('workout_logs')
                .select(`
                    id,
                    status,
                    completed_at,
                    started_at,
                    student:profiles!student_id(full_name, avatar_url),
                    workout:workouts(name)
                `)
                .in('student_id', studentIds)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false })
                .limit(10),
            supabase
                .from('meal_logs')
                .select(`
                    id,
                    consumed_at,
                    student:profiles!student_id(full_name, avatar_url),
                    meal:meals(name)
                `)
                .in('student_id', studentIds)
                .eq('check_status', true)
                .order('consumed_at', { ascending: false })
                .limit(10),
            supabase
                .from('cardio_logs')
                .select(`
                    id,
                    status,
                    completed_at,
                    started_at,
                    student:profiles!student_id(full_name, avatar_url),
                    assigned_cardio:assigned_cardios(cardio:cardios(name))
                `)
                .in('student_id', studentIds)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false })
                .limit(10),
            supabase
                .from('weight_history')
                .select(`
                    id,
                    weight_kg,
                    recorded_at,
                    student:profiles!student_id(full_name, avatar_url)
                `)
                .in('student_id', studentIds)
                .order('recorded_at', { ascending: false })
                .limit(10),
            supabase
                .from('progress_photos')
                .select(`
                    id,
                    created_at,
                    student:profiles!student_id(full_name, avatar_url)
                `)
                .in('student_id', studentIds)
                .order('created_at', { ascending: false })
                .limit(10)
        ])

        // 3. Normalize and Combine
        const feed: ActivityItem[] = []

        if (workoutsRes.data) {
            workoutsRes.data.forEach((w: any) => {
                feed.push({
                    id: w.id,
                    type: 'workout',
                    studentName: w.student?.full_name || 'Aluno',
                    studentAvatar: w.student?.avatar_url,
                    contentName: w.workout?.name || 'Treino',
                    timestamp: w.completed_at || w.started_at,
                    status: w.status
                })
            })
        }

        if (mealsRes.data) {
            mealsRes.data.forEach((m: any) => {
                feed.push({
                    id: m.id,
                    type: 'meal',
                    studentName: m.student?.full_name || 'Aluno',
                    studentAvatar: m.student?.avatar_url,
                    contentName: m.meal?.name || 'Refeição',
                    timestamp: m.consumed_at,
                    status: 'completed'
                })
            })
        }

        if (cardiosRes.data) {
            cardiosRes.data.forEach((c: any) => {
                feed.push({
                    id: c.id,
                    type: 'cardio',
                    studentName: c.student?.full_name || 'Aluno',
                    studentAvatar: c.student?.avatar_url,
                    contentName: (c.assigned_cardio as any)?.cardio?.name || 'Cardio',
                    timestamp: c.completed_at || c.started_at,
                    status: c.status
                })
            })
        }

        if (weightRes.data) {
            weightRes.data.forEach((w: any) => {
                feed.push({
                    id: w.id,
                    type: 'weight',
                    studentName: w.student?.full_name || 'Aluno',
                    studentAvatar: w.student?.avatar_url,
                    contentName: `${w.weight_kg}kg registrados`,
                    timestamp: w.recorded_at,
                    status: 'completed'
                })
            })
        }

        if (photosRes.data) {
            photosRes.data.forEach((p: any) => {
                feed.push({
                    id: p.id,
                    type: 'photo',
                    studentName: p.student?.full_name || 'Aluno',
                    studentAvatar: p.student?.avatar_url,
                    contentName: 'Novas fotos de progresso',
                    timestamp: p.created_at,
                    status: 'completed'
                })
            })
        }

        // 4. Sort and return
        const sortedFeed = feed
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        // 5. Deduplicate identical activities (same student, same type, same content)
        // This avoids showing multiple identical "concluiu um treino" logs if they clicked twice or had a sync issue.
        const uniqueFeed: ActivityItem[] = []
        const seen = new Set<string>()

        for (const item of sortedFeed) {
            const key = `${item.studentName}-${item.type}-${item.contentName}`
            if (!seen.has(key)) {
                uniqueFeed.push(item)
                seen.add(key)
            }
        }

        return uniqueFeed.slice(0, 15)

    } catch (e) {
        console.error('Error fetching activity feed:', e)
        return []
    }
}
export async function getPublicPlanPricing() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('plan_features')
        .select('plan_tier, feature_key, limit_value')
        .in('feature_key', [
            'monthly_price_cents',
            'quarterly_discount_pct',
            'annual_discount_pct',
            'student_limit',
            'photo_updates_limit',
            'price_per_student_cents',
            'free_students_limit',
            'pro_features_threshold'
        ])

    // Default prices (fallback if not in DB)
    const result: Record<string, {
        monthly: number;
        quarterly_discount: number;
        annual_discount: number;
        student_limit: number;
        photo_updates_limit: number;
        price_per_student?: number;
        free_students_limit?: number;
        pro_features_threshold?: number;
    }> = {
        on_demand: { monthly: 0, quarterly_discount: 0, annual_discount: 0, student_limit: 9999, photo_updates_limit: 2, price_per_student: 20, free_students_limit: 5, pro_features_threshold: 8 },
        start: { monthly: 49.90, quarterly_discount: 15, annual_discount: 20, student_limit: 10, photo_updates_limit: 2 },
        pro: { monthly: 149.90, quarterly_discount: 15, annual_discount: 20, student_limit: 50, photo_updates_limit: 4 },
        elite: { monthly: 299.90, quarterly_discount: 15, annual_discount: 20, student_limit: 120, photo_updates_limit: 9999 },
    }

    for (const row of data || []) {
        if (!result[row.plan_tier]) continue
        if (row.feature_key === 'monthly_price_cents') result[row.plan_tier].monthly = (row.limit_value || 0) / 100
        if (row.feature_key === 'quarterly_discount_pct') result[row.plan_tier].quarterly_discount = row.limit_value || 15
        if (row.feature_key === 'annual_discount_pct') result[row.plan_tier].annual_discount = row.limit_value || 20
        if (row.feature_key === 'student_limit') result[row.plan_tier].student_limit = row.limit_value || 0
        if (row.feature_key === 'photo_updates_limit') result[row.plan_tier].photo_updates_limit = row.limit_value || 0
        if (row.feature_key === 'price_per_student_cents') result[row.plan_tier].price_per_student = (row.limit_value || 0) / 100
        if (row.feature_key === 'free_students_limit') result[row.plan_tier].free_students_limit = row.limit_value || 0
        if (row.feature_key === 'pro_features_threshold') result[row.plan_tier].pro_features_threshold = row.limit_value || 0
    }

    return result
}
