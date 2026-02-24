'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ActivityItem = {
    id: string
    type: 'workout' | 'meal' | 'cardio' | 'weight' | 'photo' | 'ergogenic' | 'milestone' | 'alert'
    subType?: 'started' | 'completed' | 'partial' | 'fail' | 'success' | 'note' | 'inactivity' | 'full_house'
    studentName: string
    studentAvatar: string | null
    contentName: string
    timestamp: string
    status: string
    adherenceStatus?: 'success' | 'partial' | 'fail'
    notes?: string
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
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Não autorizado' }
        const file = formData.get('file') as File
        if (!file) throw new Error('Nenhum arquivo enviado')

        const fileExt = file.name?.split('.').pop() || 'jpg'
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        console.log(`Uploading trainer avatar for ${user.id} to ${filePath}...`)

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (uploadError) {
            console.error('Trainer storage upload error:', uploadError)
            return { success: false, error: `Erro no upload: ${uploadError.message}` }
        }

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        const publicUrl = data?.publicUrl

        if (!publicUrl) {
            throw new Error('Não foi possível gerar a URL pública da imagem')
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id)

        if (profileError) {
            console.error('Trainer profile update error:', profileError)
            return { success: false, error: `Erro ao atualizar perfil: ${profileError.message}` }
        }

        revalidatePath('/dashboard/trainer/profile')
        revalidatePath('/dashboard/trainer', 'layout')

        return { success: true, url: publicUrl }
    } catch (e: any) {
        console.error('Unexpected error in uploadTrainerAvatar:', e)
        return { success: false, error: e.message || 'Erro inesperado' }
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

    console.log(`[GET PROFILE] ${user.id} - asaas_subscription_id:`, data?.asaas_subscription_id)

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
            .select('id, role, auto_training_status')
            .eq('email', email)
            .single()

        if (fetchError || !student) {
            return { success: false, message: 'Aluno não encontrado. Peça para ele criar uma conta no RepTrail primeiro.' }
        }

        if (student.role === 'trainer') {
            return { success: false, message: 'Este email pertence a um treinador, não a um aluno.' }
        }

        // Restriction: Student cannot have active auto-training
        if (student.auto_training_status === 'active' || student.auto_training_status === 'trial') {
            return { success: false, message: 'Este aluno possui uma assinatura de Auto-Training ativa e não pode ser vinculado a um personal no momento.' }
        }

        // Restriction: Student cannot be linked to another trainer
        const { data: existingTrainer } = await supabase
            .from('trainer_students')
            .select('trainer_id')
            .eq('student_id', student.id)
            .eq('active', true)
            .maybeSingle()

        if (existingTrainer) {
            return { success: false, message: 'Este aluno já está vinculado a outro personal trainer.' }
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
        const { data: trainers, error } = await supabase
            .rpc('get_trainer_ranking_stats')

        if (error) {
            console.error('Error fetching trainer ranking via RPC:', error)
            return []
        }

        if (!trainers) return []

        // Calculate scores
        const tierPoints: Record<string, number> = {
            'none': 0,
            'start': 0,
            'on_demand': 50,
            'pro': 100,
            'elite': 500
        }

        const ranking = trainers
            .filter((t: any) => t.plan_tier && t.plan_tier !== 'none')
            .map((t: any) => {
                const studentCount = Number(t.student_count || 0)
                const rating = Number(t.rating || 0)

                // New Score Formula: (Students * 10) + (Rating * 50)
                // No more plan_tier bias.
                const score = (studentCount * 10) + (rating * 50)

                return {
                    id: t.trainer_id,
                    full_name: t.full_name || 'Treinador sem nome',
                    avatar_url: t.avatar_url,
                    plan_tier: t.plan_tier, // Keep for UI but it doesn't affect score
                    rating: isNaN(rating) ? 0 : rating,
                    studentCount,
                    score: isNaN(score) ? 0 : score,
                    trainer_code: t.trainer_code ? String(t.trainer_code).trim() : null
                }
            })

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

    return (data?.plan_tier as 'none' | 'on_demand' | 'start' | 'pro' | 'elite') || 'none'
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

    const tier = (profile?.plan_tier as 'none' | 'on_demand' | 'start' | 'pro' | 'elite') || 'none'

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
        const { data: trainerStudents } = await supabase
            .from('trainer_students')
            .select('student_id')
            .eq('trainer_id', user.id)
            .neq('active', false)

        if (!trainerStudents || trainerStudents.length === 0) return []
        const studentIds = trainerStudents.map(s => s.student_id)

        // 2. Fetch latest logs from all sources
        const [workoutsRes, mealsRes, cardiosRes, weightRes, photosRes, ergoLogsRes, milestonesRes, alertsRes] = await Promise.all([
            // Workouts: Started or Completed
            supabase
                .from('workout_logs')
                .select(`
                    id,
                    status,
                    adherence_status,
                    completed_at,
                    started_at,
                    notes,
                    student:profiles!student_id(full_name, avatar_url),
                    workout:workouts(name)
                `)
                .in('student_id', studentIds)
                .in('status', ['in_progress', 'completed'])
                .order('started_at', { ascending: false })
                .limit(15),

            // Meals
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

            // Cardios: In Progress or Completed
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
                .in('status', ['in_progress', 'completed'])
                .order('started_at', { ascending: false })
                .limit(10),

            // Weight
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
                .limit(5),

            // Photos
            supabase
                .from('progress_photos')
                .select(`
                    id,
                    created_at,
                    student:profiles!student_id(full_name, avatar_url)
                `)
                .in('student_id', studentIds)
                .order('created_at', { ascending: false })
                .limit(5),

            // Ergogenics
            supabase
                .from('ergogenic_logs')
                .select(`
                    id,
                    created_at,
                    student:profiles!student_id(full_name, avatar_url),
                    ergogenic:ergogenics(name)
                `)
                .in('student_id', studentIds)
                .order('created_at', { ascending: false })
                .limit(10),

            // Milestones (100% Adherence)
            supabase
                .from('daily_tracking')
                .select(`
                    id,
                    date,
                    diet_percentage,
                    workout_status,
                    cardio_status,
                    ergogenics_status,
                    student:profiles!user_id(full_name, avatar_url)
                `)
                .in('user_id', studentIds)
                .eq('diet_percentage', 100)
                .in('workout_status', ['completed', 'none'])
                .in('cardio_status', ['completed', 'none'])
                .in('ergogenics_status', ['completed', 'none'])
                .order('date', { ascending: false })
                .limit(10),

            // Alerts (Inactivity - no login for 3+ days)
            supabase
                .from('profiles')
                .select('id, full_name, avatar_url, last_seen_at')
                .in('id', studentIds)
                .lt('last_seen_at', new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString())
                .order('last_seen_at', { ascending: false })
        ])

        // 3. Normalize and Combine
        const feed: ActivityItem[] = []

        if (workoutsRes.data) {
            workoutsRes.data.forEach((w: any) => {
                feed.push({
                    id: w.id,
                    type: 'workout',
                    subType: w.status === 'in_progress' ? 'started' : (w.adherence_status || 'completed'),
                    studentName: w.student?.full_name || 'Aluno',
                    studentAvatar: w.student?.avatar_url,
                    contentName: w.workout?.name || 'Treino',
                    timestamp: w.status === 'in_progress' ? w.started_at : w.completed_at,
                    status: w.status,
                    adherenceStatus: w.adherence_status
                })
                if (w.notes) {
                    feed.push({
                        id: `${w.id}-note`,
                        type: 'workout',
                        subType: 'note',
                        studentName: w.student?.full_name || 'Aluno',
                        studentAvatar: w.student?.avatar_url,
                        contentName: `Nota: ${w.notes.substring(0, 50)}${w.notes.length > 50 ? '...' : ''}`,
                        notes: w.notes,
                        timestamp: w.completed_at || w.started_at,
                        status: 'completed'
                    })
                }
            })
        }

        if (mealsRes.data) {
            mealsRes.data.forEach((m: any) => {
                feed.push({
                    id: m.id,
                    type: 'meal',
                    subType: 'completed',
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
                    subType: c.status === 'in_progress' ? 'started' : 'completed',
                    studentName: c.student?.full_name || 'Aluno',
                    studentAvatar: c.student?.avatar_url,
                    contentName: (c.assigned_cardio as any)?.cardio?.name || 'Cardio',
                    timestamp: c.status === 'in_progress' ? c.started_at : c.completed_at,
                    status: c.status
                })
            })
        }

        if (weightRes.data) {
            weightRes.data.forEach((w: any) => {
                feed.push({
                    id: w.id,
                    type: 'weight',
                    subType: 'completed',
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
                    subType: 'completed',
                    studentName: p.student?.full_name || 'Aluno',
                    studentAvatar: p.student?.avatar_url,
                    contentName: 'Novas fotos de progresso',
                    timestamp: p.created_at,
                    status: 'completed'
                })
            })
        }

        if (ergoLogsRes.data) {
            ergoLogsRes.data.forEach((e: any) => {
                feed.push({
                    id: e.id,
                    type: 'ergogenic',
                    subType: 'completed',
                    studentName: e.student?.full_name || 'Aluno',
                    studentAvatar: e.student?.avatar_url,
                    contentName: e.ergogenic?.name || 'Ergogênico',
                    timestamp: e.created_at,
                    status: 'completed'
                })
            })
        }

        if (milestonesRes.data) {
            milestonesRes.data.forEach((m: any) => {
                // Only count as milestone if at least one task was completed (not just 'none' for everything)
                const hasActivity = m.diet_percentage > 0 || m.workout_status === 'completed' || m.cardio_status === 'completed' || m.ergogenics_status === 'completed';

                if (hasActivity) {
                    feed.push({
                        id: m.id,
                        type: 'milestone',
                        subType: 'full_house',
                        studentName: m.student?.full_name || 'Aluno',
                        studentAvatar: m.student?.avatar_url,
                        contentName: 'METAS 100% CONCLUÍDAS! 🔥',
                        timestamp: m.date,
                        status: 'completed'
                    })
                }
            })
        }

        if (alertsRes.data) {
            alertsRes.data.forEach((a: any) => {
                feed.push({
                    id: `${a.id}-alert`,
                    type: 'alert',
                    subType: 'inactivity',
                    studentName: a.full_name || 'Aluno',
                    studentAvatar: a.avatar_url,
                    contentName: 'Está inativo há mais de 48 horas ⚠️',
                    timestamp: a.last_seen_at,
                    status: 'warning'
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
            const key = `${item.studentName}-${item.type}-${item.subType}-${item.contentName}`
            if (!seen.has(key)) {
                uniqueFeed.push(item)
                seen.add(key)
            }
        }

        return uniqueFeed.slice(0, 50)

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


export async function toggleStudentStatus(relationshipId: string, isActive: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Unauthorized' }

    // Verify ownership
    const { data: rel } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('id', relationshipId)
        .single()

    if (!rel || rel.trainer_id !== user.id) {
        return { success: false, message: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('trainer_students')
        .update({ active: isActive })
        .eq('id', relationshipId)

    if (error) {
        console.error('Error toggling student status:', error)
        return { success: false, message: error.message }
    }

    revalidatePath(`/dashboard/trainer/students/${relationshipId}`)
    revalidatePath('/dashboard/trainer/students')
    return { success: true }
}
