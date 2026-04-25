'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { normalizeDays } from '@/lib/utils'
import { createAdminClient } from '@/lib/supabase/admin'

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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
        const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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

export async function deactivateAndPurgeStudent(relationshipId: string, studentId: string) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()
    const { data: { user } } = await (await createClient()).auth.getUser()
    const { revalidateTag } = await import('next/cache')

    if (!user) return { error: 'Unauthorized' }

    try {
        // 1. Check if it's a placeholder (pending_student_links)
        const { data: placeholder } = await adminSupabase
            .from('pending_student_links')
            .select('id')
            .eq('id', relationshipId)
            .eq('trainer_id', user.id)
            .maybeSingle()

        if (placeholder) {
            await adminSupabase
                .from('pending_student_links')
                .update({ status: 'archived' }) // We don't delete to keep history if needed, but archived won't show
                .eq('id', relationshipId)
        } else {
            // 2. Deactivate Real Relationship
            await adminSupabase
                .from('trainer_students')
                .update({ active: false })
                .eq('id', relationshipId)
                .eq('trainer_id', user.id)
        }

        const purgeId = (studentId && studentId !== 'null' && studentId !== relationshipId) ? studentId : (placeholder ? relationshipId : null);

        if (purgeId) {
            console.log(`[PURGE] Wiping data for student/placeholder: ${purgeId}`);
            await Promise.all([
                adminSupabase.from('assigned_workouts').delete().eq('student_id', purgeId),
                adminSupabase.from('assigned_diets').delete().eq('student_id', purgeId),
                adminSupabase.from('assigned_cardios').delete().eq('student_id', purgeId),
                adminSupabase.from('ergogenics').delete().eq('student_id', purgeId)
            ])
        }

        // 4. Invalidate EVERYTHING to ensure libraries reflect the removal
        revalidateTag(`trainer-students-${user.id}`, 'page')
        revalidateTag(`trainer-diets-${user.id}`, 'page') // DietService.getTrainerDiets
        revalidateTag(`trainer-${user.id}`, 'page')      // WorkoutService.getTrainerWorkouts
        
        revalidatePath('/dashboard/trainer/students')
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/trainer/workouts')
        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath(`/dashboard/trainer/students/${relationshipId}`)
        return { success: true }
    } catch (e: any) {
        console.error('[PURGE] Error deactivating student:', e)
        return { error: e.message }
    }
}

export async function createStudent(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Unauthorized' }

    const email = formData.get('email')?.toString().trim().toLowerCase()
    const name = formData.get('name')?.toString().trim()
    const monthlyFee = parseFloat(formData.get('monthlyFee')?.toString() || '0')

    if (!email) return { success: false, message: 'O e-mail é obrigatório.' }

    try {
        // 1. Check if profile exists
        let { data: student, error: fetchError } = await supabase
            .from('profiles')
            .select('id, role, auto_training_status')
            .eq('email', email)
            .maybeSingle()

        let studentId = student?.id

        if (!student) {
            // 🚀 GHOST PROFILE: Create a profile even if no auth account exists
            console.log(`[CREATE-STUDENT] Creating Ghost Profile for ${email}`);
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: crypto.randomUUID(),
                    email,
                    full_name: name || 'Aluno',
                    role: 'student',
                    is_placeholder: true
                })
                .select('id')
                .single()

            if (createError) throw createError
            studentId = newProfile.id
        } else {
            // Validate existing profile
            if (student.role === 'trainer') {
                return { success: false, message: 'Este email pertence a um treinador.' }
            }

            if (student.auto_training_status === 'active') {
                return { success: false, message: 'Este aluno possui uma assinatura ativa de Auto-Training.' }
            }

            // Check if already linked to another trainer
            const { data: existingLink } = await supabase
                .from('trainer_students')
                .select('trainer_id, active')
                .eq('student_id', studentId)
                .eq('active', true)
                .maybeSingle()

            if (existingLink && existingLink.trainer_id !== user.id) {
                return { success: false, message: 'Este aluno já está vinculado a outro personal.' }
            }
        }

        // 2. Link/Update Student to Trainer (Unified Upsert)
        const { error: linkError } = await supabase
            .from('trainer_students')
            .upsert({
                trainer_id: user.id,
                student_id: studentId,
                monthly_fee: monthlyFee,
                active: true,
                billing_source: 'manual'
            }, { onConflict: 'trainer_id,student_id' })

        if (linkError) throw linkError

        revalidatePath('/dashboard/trainer/students')
        return { success: true, message: 'Aluno vinculado com sucesso!', studentId }

    } catch (e: any) {
        console.error('[CREATE-STUDENT] Error:', e)
        return { success: false, message: 'Erro ao vincular aluno: ' + e.message }
    }
}

export async function getTrainerStudents() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // 🚀 UNIFIED ARCHITECTURE: Fetch everything from trainer_students
    const { data: results, error } = await supabase
        .from('trainer_students')
        .select(`
            id,
            student_id,
            monthly_fee,
            active,
            payment_day,
            last_payment_date,
            student:profiles!student_id(
                id,
                full_name,
                email,
                avatar_url,
                is_placeholder
            )
        `)
        .eq('trainer_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[GET-STUDENTS] Error:', error)
        return []
    }

    return (results || []).map((s: any) => {
        const profile = Array.isArray(s.student) ? s.student[0] : s.student
        return {
            ...s,
            is_placeholder: !!profile?.is_placeholder,
            student: {
                id: profile?.id,
                full_name: profile?.full_name || 'Sem nome',
                email: profile?.email || '',
                avatar_url: profile?.avatar_url || null
            }
        }
    })
}

export async function getStudentRelationship(relationshipId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Try real relationship
    const { data, error } = await supabase
        .from('trainer_students')
        .select(`
            *,
            student:profiles!student_id(
                *,
                details:student_details(*),
                progress_photos(*),
                assigned_workouts(
                    id,
                    active,
                    day_of_week,
                    workout:workouts(id, name)
                ),
                assigned_diets(
                    id,
                    active,
                    days_of_week,
                    diet:diets(id, name)
                ),
                assigned_cardios(
                    id,
                    active,
                    duration_minutes,
                    suggested_intensity,
                    days_of_week,
                    cardio:cardios(id, name)
                )
            )
        `)
        .eq('id', relationshipId)
        .eq('trainer_id', user.id)
        .maybeSingle()

    if (data) return data

    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log(`[TRAINER-ACTIONS] getStudentRelationship called for ID: ${relationshipId}. Auth User: ${authUser?.id}`);

    // 2. Try pending link (placeholder)
    const { data: pending, error: pendingError } = await supabase
        .from('pending_student_links')
        .select('*')
        .eq('id', relationshipId)
        .eq('trainer_id', user.id)
        .maybeSingle()

    if (pending) {
        // Fetch specific entities for the placeholder
        console.log(`[TRAINER-ACTIONS] Placeholder Found: ${pending.id} (${pending.student_name}). Diets=${pending.diet_ids?.length}, Cardios=${pending.cardio_ids?.length}, Ergos=${pending.ergogenic_data?.length}`);
        if (pending.diet_ids?.length > 0) console.log(`[TRAINER-ACTIONS] Placeholder Diet IDs: ${JSON.stringify(pending.diet_ids)}`);
        
        const metadata = (pending.ergogenic_data as any[])?.find(e => e.__metadata) || {};

        const [workouts, diets, cardios] = await Promise.all([
            pending.workout_ids?.length ? supabase.from('workouts').select('*, workout_exercises(*, exercise:exercises(*))').in('id', pending.workout_ids) : Promise.resolve({ data: [], error: null }),
            pending.diet_ids?.length ? supabase.from('diets').select('*, meals(*, items:meal_items(*))').in('id', pending.diet_ids) : Promise.resolve({ data: [], error: null }),
            pending.cardio_ids?.length ? supabase.from('cardios').select('*').in('id', pending.cardio_ids) : Promise.resolve({ data: [], error: null })
        ])

        if (workouts.error) console.error("[TRAINER-ACTIONS] Workouts fetch error:", workouts.error.message)
        if (diets.error) console.error("[TRAINER-ACTIONS] Diets fetch error:", diets.error.message)
        if (cardios.error) console.error("[TRAINER-ACTIONS] Cardios fetch error:", cardios.error.message)

        console.log(`[TRAINER-ACTIONS] RAW Data Results for ${pending.student_name}:`, {
            id: pending.id,
            workout_results: workouts.data?.length || 0,
            diet_results: diets.data?.length || 0,
            cardio_results: cardios.data?.length || 0,
            requested_diet_ids: pending.diet_ids?.length || 0,
            requested_cardio_ids: pending.cardio_ids?.length || 0
        });

        if (diets.data?.length === 0 && pending.diet_ids?.length > 0) {
            console.warn(`[TRAINER-ACTIONS] WARNING: Diet IDs present in placeholder but query returned EMPTY. IDs: ${JSON.stringify(pending.diet_ids)}`);
            // Debug check with Admin Client
            const admin = createAdminClient();
            const { data: adminDiets } = await admin.from('diets').select('id, trainer_id, name').in('id', pending.diet_ids);
            console.log(`[TRAINER-ACTIONS] DEBUG ADMIN CHECK: Found ${adminDiets?.length || 0} diets with admin bypass.`, adminDiets);
        }

        if (cardios.data?.length === 0 && pending.cardio_ids?.length > 0) {
            console.warn(`[TRAINER-ACTIONS] WARNING: Cardio IDs present in placeholder but query returned EMPTY. IDs: ${JSON.stringify(pending.cardio_ids)}`);
            // Debug check with Admin Client
            const admin = createAdminClient();
            const { data: adminCardios } = await admin.from('cardios').select('id, trainer_id, name').in('id', pending.cardio_ids);
            console.log(`[TRAINER-ACTIONS] DEBUG ADMIN CHECK: Found ${adminCardios?.length || 0} cardios with admin bypass.`, adminCardios);
        }

        const cardioMetadata = metadata.cardio_metadata || [];
        console.log(`[TRAINER-ACTIONS] Placeholder Metadata Found: Diets=${(metadata.diet_metadata || []).length}, Cardios=${cardioMetadata.length}`);
        if (cardioMetadata.length > 0) {
            console.log(`[TRAINER-ACTIONS] Cardio Meta IDs: ${cardioMetadata.map((m: any) => m.id).join(', ')}`);
        }

        const mapped = {
            id: pending.id,
            trainer_id: pending.trainer_id,
            student_id: pending.id, // Use link ID as student_id for placeholders
            is_placeholder: true,
            active: pending.status === 'pending',
            monthly_fee: metadata.monthly_fee || 0,
            payment_day: metadata.payment_day || null,
            created_at: pending.created_at,
            student: {
                full_name: pending.student_name,
                email: pending.student_email,
                whatsapp: metadata.whatsapp || null,
                avatar_url: null,
                details: {
                    starting_weight: metadata.weight,
                    height: metadata.height,
                    body_fat: metadata.body_fat,
                    steroid_use: metadata.steroid_use || (pending.ergogenic_data as any[])?.some(e => !e.__metadata),
                },
                progress_photos: [],
                ergogenics: (pending.ergogenic_data as any[])?.filter(e => e && typeof e === 'object' && !e.__metadata).map((e, idx) => {
                    const days = e.application_days || e.days || [];
                    console.log(`[TRAINER-ACTIONS] Mapping Placeholder Ergo #${idx} (${e.name}): Days=${JSON.stringify(days)}`);
                    return {
                        ...e,
                        id: e.id || `pe-${idx}-${e.name}`,
                        student_id: pending.id,
                        start_date: new Date().toISOString(),
                        application_days: days
                    };
                }) || [],
                assigned_workouts: (workouts.data || []).map(w => {
                    const meta = metadata.workout_days?.find((m: any) => m.id === w.id);
                    return {
                        id: `pw-${w.id}`,
                        active: true,
                        day_of_week: meta?.day ?? null,
                        workout: w
                    };
                }),
                assigned_diets: (diets.data || []).map(d => {
                    const meta = (metadata?.diet_metadata || []).find((m: any) => m.id === d.id);
                    const days = (meta?.days && meta.days.length > 0) ? normalizeDays(meta.days) : (metadata?.diet_days ? normalizeDays(metadata.diet_days) : [0, 1, 2, 3, 4, 5, 6]);
                    console.log(`[TRAINER-ACTIONS] Mapping Placeholder Diet ${d.id} (${d.name}): Days=${JSON.stringify(days)}`);
                    return {
                        id: `pd-${d.id}`,
                        active: true,
                        days_of_week: days,
                        diet: d
                    };
                }),
                assigned_cardios: (cardios.data || []).map(c => {
                    const meta = cardioMetadata.find((m: any) => m.id === c.id);
                    const days = (meta?.days && meta.days.length > 0) ? normalizeDays(meta.days) : [0, 1, 2, 3, 4, 5, 6];
                    console.log(`[TRAINER-ACTIONS] Mapping Placeholder Cardio ${c.id} (${c.name}): Meta Found? ${!!meta}, Days=${JSON.stringify(days)}`);
                    return {
                        id: `pc-${c.id}`,
                        active: true,
                        student_id: pending.id,
                        cardio_id: c.id,
                        duration_minutes: meta?.duration || c.duration_minutes || 30,
                        suggested_intensity: meta?.intensity || c.suggested_intensity || 'Moderada',
                        days_of_week: days,
                        cardio: c
                    }
                })
            }
        }

        // Final normalization check for consistency
        if (mapped?.student) {
            if (mapped.student.assigned_diets) {
                mapped.student.assigned_diets = mapped.student.assigned_diets.map((d: any) => ({
                    ...d,
                    days_of_week: normalizeDays(d.days_of_week)
                }));
            }
            if (mapped.student.assigned_cardios) {
                mapped.student.assigned_cardios = mapped.student.assigned_cardios.map((c: any) => ({
                    ...c,
                    days_of_week: normalizeDays(c.days_of_week)
                }));
            }
            if (mapped.student.ergogenics) {
                mapped.student.ergogenics = mapped.student.ergogenics.map((e: any) => ({
                    ...e,
                    application_days: normalizeDays(e.application_days || (e as any).days)
                }));
            }
        }

        console.log(`[TRAINER-ACTIONS] Final Mapped Data: Diets=${mapped.student.assigned_diets.length}, Cardios=${mapped.student.assigned_cardios.length}, Ergos=${mapped.student.ergogenics.length}`);
        return mapped;
    }

    return null
}
export async function getTrainerRanking() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        // 2. Fetch REAL student counts for all active trainers
        // 3. Fetch REAL ratings and data from profiles to bypass RPC staleness
        const [
            { data: realCounts, error: countsError },
            { data: realProfiles, error: profilesError }
        ] = await Promise.all([
            supabase.from('trainer_students').select('trainer_id').eq('active', true),
            supabase.from('profiles').select('id, average_rating, plan_tier, full_name, avatar_url, region, trainer_code').eq('role', 'trainer')
        ])

        if (countsError) console.error('Error fetching real student counts:', countsError)

        // Group counts by trainer_id
        const countMap: Record<string, number> = {}
        realCounts?.forEach(c => {
            countMap[c.trainer_id] = (countMap[c.trainer_id] || 0) + 1
        })

        // Map profiles for quick access
        const profileMap: Record<string, any> = {}
        realProfiles?.forEach(p => {
            profileMap[p.id] = p
        })

        // 4. Map and Calculate Scores
        const tierPoints: Record<string, number> = {
            'none': 0,
            'start': 0,
            'on_demand': 50,
            'pro': 100,
            'elite': 500
        }

        const ranking = (realProfiles || [])
            .filter((p: any) => p.plan_tier && p.plan_tier !== 'none' && p.trainer_code)
            .map((p: any) => {
                const studentCount = countMap[p.id] || 0
                const rating = Number(p.average_rating || 0)
                const prestigePoints = tierPoints[p.plan_tier as string] || 0

                // Prestige-based Score Formula: 
                // Base (Plan) + (Students * 20) + (Rating * 50)
                const score = prestigePoints + (studentCount * 20) + (rating * 50)

                // Fallback Rating for higher tiers to maintain "Elite" look
                const displayRating = rating > 0 
                    ? rating 
                    : (p.plan_tier === 'elite' ? 5.0 : p.plan_tier === 'pro' ? 4.9 : 0)

                // Realistic Student Count Fallback (Social Proof)
                const displayStudentCount = studentCount > 0 
                    ? studentCount 
                    : (p.plan_tier === 'elite' ? 10 : p.plan_tier === 'pro' ? 5 : 0)

                return {
                    id: p.id,
                    full_name: p.full_name || 'Treinador sem nome',
                    avatar_url: p.avatar_url,
                    plan_tier: p.plan_tier,
                    region: p.region || 'Brasil',
                    rating: isNaN(displayRating) ? 0 : displayRating,
                    studentCount: displayStudentCount,
                    score: isNaN(score) ? 0 : score,
                    trainer_code: p.trainer_code ? String(p.trainer_code).trim() : null
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'none'

    const [
        { data: profile },
        { count: activeStudentsCount }
    ] = await Promise.all([
        supabase.from('profiles').select('plan_tier').eq('id', user.id).single(),
        supabase.from('trainer_students').select('*', { count: 'exact', head: true }).eq('trainer_id', user.id).eq('active', true)
    ])

    const tier = (profile?.plan_tier as 'none' | 'on_demand' | 'start' | 'pro' | 'elite') || 'none'

    if (tier === 'on_demand' && (activeStudentsCount || 0) >= 8) {
        return 'pro'
    }

    return tier
}

export async function getTrainerActivityFeed(): Promise<ActivityItem[]> {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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

    if (!user) return { success: false, error: 'Não autorizado' }

    // 1. Try to find in REAL students first
    const { data: rel } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('id', relationshipId)
        .maybeSingle()

    if (rel) {
        if (rel.trainer_id !== user.id) {
            return { success: false, error: 'Não autorizado' }
        }

        // Check limits if activating
        if (isActive) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('asaas_subscription_id, is_billing_exempt')
                .eq('id', user.id)
                .single()

            const { count } = await supabase
                .from('trainer_students')
                .select('*', { count: 'exact', head: true })
                .eq('trainer_id', user.id)
                .eq('active', true)

            const activeCount = count || 0
            if (activeCount >= 5 && !profile?.asaas_subscription_id && !profile?.is_billing_exempt) {
                return {
                    success: false,
                    error: 'Limite gratuito atingido. Para ter mais de 5 alunos ativos, você precisa configurar sua assinatura no menu Planos.'
                }
            }
        }

        const { error } = await supabase
            .from('trainer_students')
            .update({ active: isActive })
            .eq('id', relationshipId)

        if (error) return { success: false, error: error.message }
        
        revalidatePath('/dashboard/trainer/students')
        return { success: true }
    }

    // 2. If not found, try to find in PENDING links (Placeholders)
    const { data: pending } = await supabase
        .from('pending_student_links')
        .select('trainer_id')
        .eq('id', relationshipId)
        .maybeSingle()

    if (pending) {
        if (pending.trainer_id !== user.id) {
            return { success: false, error: 'Não autorizado' }
        }

        return { success: true }
    }

    return { success: false, error: 'Aluno não encontrado' }
}

export async function findStudentByName(name: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !name) return { exact: null, suggestions: [] }

    // 1. Search in profiles that are linked to this trainer
    const { data: results, error } = await supabase
        .from('trainer_students')
        .select(`
            student_id,
            student:profiles!student_id(id, full_name, email, is_placeholder)
        `)
        .eq('trainer_id', user.id)
        .eq('active', true)

    if (error || !results) return { exact: null, suggestions: [] }

    const normalizedTarget = name.toLowerCase().trim()
    const suggestions: any[] = []
    let exact: any = null

    results.forEach((r: any) => {
        const student = Array.isArray(r.student) ? r.student[0] : r.student
        if (!student) return

        const studentName = (student.full_name || '').toLowerCase().trim()
        
        const matchData = {
            student_id: student.id,
            full_name: student.full_name,
            email: student.email,
            is_placeholder: !!student.is_placeholder
        }

        if (studentName === normalizedTarget) {
            exact = matchData
        } else if (studentName.includes(normalizedTarget) || normalizedTarget.includes(studentName)) {
            suggestions.push(matchData)
        }
    })

    return { exact, suggestions: suggestions.slice(0, 5) }
}
