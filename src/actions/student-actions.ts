'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStudentData(
    relationshipId: string,
    studentId: string,
    trainerId: string,
    data: {
        weight?: number,
        body_fat?: number,
        monthly_fee?: number,
        payment_day?: number,
        steroid_use?: boolean,
        whatsapp?: string,
        email?: string,
        height?: number,
        age?: number,
        sex?: string,
        activity_level?: string,
        observations?: string
    }
) {
    const supabase = await createClient()

    try {
        // 1. Standard Profile updates (WhatsApp, Email)
        if (data.whatsapp !== undefined || data.email !== undefined) {
            const updateObj: any = {}
            if (data.whatsapp !== undefined) updateObj.whatsapp = data.whatsapp
            if (data.email !== undefined) updateObj.email = data.email.toLowerCase().trim()

            const { error: profileError } = await supabase
                .from('profiles')
                .update(updateObj)
                .eq('id', studentId)

            if (profileError) {
                console.error('Error updating student profile:', profileError)
            }
        }

        // 2. Update physical data (student_details) - USE UPSERT for Ghost Profiles
        if (
            data.weight !== undefined || 
            data.body_fat !== undefined || 
            data.steroid_use !== undefined ||
            data.height !== undefined ||
            data.age !== undefined ||
            data.sex !== undefined ||
            data.activity_level !== undefined ||
            data.observations !== undefined
        ) {
            const upsertDetails: any = { 
                id: studentId,
                updated_at: new Date().toISOString() 
            }
            if (data.weight !== undefined) upsertDetails.current_weight = data.weight
            if (data.height !== undefined) upsertDetails.height = data.height
            if (data.age !== undefined) upsertDetails.age = data.age
            if (data.sex !== undefined) upsertDetails.sex = data.sex
            if (data.activity_level !== undefined) upsertDetails.activity_level = data.activity_level
            if (data.observations !== undefined) upsertDetails.observations = data.observations
            if (data.body_fat !== undefined) upsertDetails.body_fat = data.body_fat
            if (data.steroid_use !== undefined) upsertDetails.steroid_use = data.steroid_use

            const { error: detailsError } = await supabase
                .from('student_details')
                .upsert(upsertDetails, { onConflict: 'id' })

            if (detailsError) throw detailsError

            // Save Weight History
            if (data.weight !== undefined) {
                try {
                    await supabase.from('weight_history').insert({
                        student_id: studentId,
                        weight_kg: data.weight,
                        recorded_at: new Date().toISOString()
                    })
                } catch (e) {
                    console.error('Error saving weight history:', e)
                }
            }
        }

        // 3. Update financial data
        if (data.monthly_fee !== undefined || data.payment_day !== undefined) {
            const { error: relationshipError } = await supabase
                .from('trainer_students')
                .update({
                    monthly_fee: data.monthly_fee,
                    payment_day: data.payment_day
                })
                .eq('id', relationshipId)

            if (relationshipError) throw relationshipError
        }

        revalidatePath(`/dashboard/trainer/students/${relationshipId}`)
        revalidatePath('/dashboard/trainer/students')
        revalidatePath('/dashboard/trainer/ergogenics')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating student data:', error)
        return { success: false, error: error.message }
    }
}

export async function markPaymentAsReceived(studentId: string, trainerId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { error } = await supabase
            .from('trainer_students')
            .update({
                last_payment_date: new Date().toISOString()
            })
            .eq('trainer_id', trainerId)
            .eq('student_id', studentId)

        if (error) throw error

        const { data: relationship } = await supabase
            .from('trainer_students')
            .select('id')
            .eq('trainer_id', trainerId)
            .eq('student_id', studentId)
            .maybeSingle()

        if (relationship) {
            revalidatePath(`/dashboard/trainer/students/${relationship.id}`)
        }

        revalidatePath('/dashboard/trainer/students')
        return { success: true }
    } catch (error: any) {
        console.error('Error marking payment as received:', error)
        return { success: false, error: error.message }
    }
}
export async function getStudentTrainer(studentId: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('trainer_students')
            .select(`
                *,
                trainer:profiles!trainer_id(
                    id,
                    full_name,
                    trainer_code,
                    avatar_url,
                    bio,
                    specialty,
                    location,
                    cref,
                    average_rating,
                    total_reviews,
                    is_elite,
                    whatsapp,
                    instagram,
                    plan_tier
                )
            `)
            .eq('student_id', studentId)
            .eq('active', true)
            .maybeSingle()

        if (error) throw error

        // Validate trainer_code exists
        if (data && data.trainer && !data.trainer.trainer_code) {
            console.warn(`Trainer ${data.trainer.id} (${data.trainer.full_name}) does not have a trainer_code`)
        }

        return data
    } catch (e) {
        console.error('Error fetching student trainer:', e)
        return null
    }
}
export async function searchTrainers(filters: {
    query?: string,
    region?: string,
    specialty?: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'popular'
}) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer')
        .not('trainer_code', 'is', null)
        .neq('trainer_code', '')

    if (filters.query) {
        query = query.ilike('full_name', `%${filters.query}%`)
    }
    if (filters.region) {
        query = query.ilike('region', `%${filters.region}%`)
    }
    if (filters.specialty) {
        query = query.eq('specialty', filters.specialty)
    }
    if (filters.minPrice) {
        query = query.gte('monthly_price', filters.minPrice)
    }
    if (filters.maxPrice) {
        query = query.lte('monthly_price', filters.maxPrice)
    }
    if (filters.minRating) {
        query = query.gte('average_rating', filters.minRating)
    }

    // Sorting
    if (filters.sortBy === 'rating') {
        query = query.order('average_rating', { ascending: false })
    } else if (filters.sortBy === 'price_asc') {
        query = query.order('monthly_price', { ascending: true })
    } else if (filters.sortBy === 'price_desc') {
        query = query.order('monthly_price', { ascending: false })
    } else if (filters.sortBy === 'popular') {
        // Since we don't have a direct 'popular' column that is reliable across all, 
        // we'll use average_rating as proxy or just rating.
        // The user wants it based on Active Students. 
        // For now, let's use average_rating until we have a students_count column.
        query = query.order('average_rating', { ascending: false })
    } else {
        // Default: Highest rating first
        query = query.order('average_rating', { ascending: false })
    }

    console.log('--- SEARCH TRAINERS DEBUG ---')
    console.log('Filters:', JSON.stringify(filters, null, 2))

    const { data: rawProfiles, error } = await query.limit(40)
    if (error || !rawProfiles) return []

    // ─── HARD FILTER (Bypass potential DB filter mismatch) ────────────────────
    const profiles = rawProfiles.filter(p => p.trainer_code && p.trainer_code.trim() !== '')
    if (profiles.length === 0) return []

    // ─── ENRICH DATA (Elite metrics) ──────────────────────────────────────────
    // Fetch REAL student counts for all active trainers to ensure consistency with ranking
    const [
        { data: allActiveCounts, error: countsError }
    ] = await Promise.all([
        supabase.from('trainer_students').select('trainer_id').eq('active', true)
    ])

    if (countsError) console.error('Enrichment: Student Counts Error:', countsError)

    // Group counts by trainer_id
    const countMap: Record<string, number> = {}
    allActiveCounts?.forEach(c => {
        countMap[c.trainer_id] = (countMap[c.trainer_id] || 0) + 1
    })

    const tierPoints: Record<string, number> = {
        'none': 0,
        'start': 0,
        'on_demand': 50,
        'pro': 100,
        'elite': 500
    }

    const enrichedProfiles = profiles.map(p => {
        const studentCount = countMap[p.id] || 0
        const rating = Number(p.average_rating || 0)
        const prestigePoints = tierPoints[p.plan_tier as string] || 0
        
        // Exact same score formula as in trainer-actions.ts
        const score = prestigePoints + (studentCount * 20) + (rating * 50)

        return {
            ...p,
            rating,
            studentCount,
            score: Math.round(score)
        }
    })

    return enrichedProfiles
}

export async function getTrainerByCode(code: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, trainer_code, avatar_url, role')
            .eq('role', 'trainer')
            .eq('trainer_code', code.toUpperCase())
            .single()

        if (error) throw error
        return data
    } catch (e) {
        console.error('Error fetching trainer by code:', e)
        return null
    }
}
export async function getStudentProfile(studentId: string) {
    const supabase = await createClient()

    try {
        const [
            { data: profile, error: profileError },
            { data: details, error: detailsError }
        ] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', studentId).maybeSingle(),
            supabase.from('student_details').select('*').eq('id', studentId).maybeSingle()
        ])

        if (profileError) throw profileError
        if (detailsError && detailsError.code !== 'PGRST116') throw detailsError

        if (!profile) return null

        return { ...profile, details }
    } catch (e: any) {
        console.error('Error fetching student profile:', e?.message ?? e?.code ?? JSON.stringify(e))
        return null
    }
}

export async function updateStudentProfile(data: {
    full_name?: string
    birth_date?: string
    age?: number
    sex?: string
    height?: number
    weight?: number
    body_fat?: number
    goal?: string
    activity_level?: string
    observations?: string
    steroid_use?: boolean
    whatsapp?: string
    neck_cm?: number
    waist_cm?: number
    hip_cm?: number
}) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    try {
        // 1. Update Profile (profiles table)
        if (data.full_name !== undefined || data.whatsapp !== undefined) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    whatsapp: data.whatsapp
                })
                .eq('id', user.id)
            if (profileError) throw profileError
        }

        // 2. Update Details (student_details table)
        const detailsUpdate: any = {
            updated_at: new Date().toISOString()
        }

        if (data.birth_date !== undefined) detailsUpdate.birth_date = data.birth_date
        if (data.age !== undefined) detailsUpdate.age = typeof data.age === 'string' ? parseInt(data.age) : data.age
        if (data.sex !== undefined) detailsUpdate.sex = data.sex
        if (data.height !== undefined) detailsUpdate.height = typeof data.height === 'string' ? parseFloat(data.height) : data.height
        if (data.weight !== undefined) detailsUpdate.current_weight = typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight
        if (data.body_fat !== undefined) detailsUpdate.body_fat = typeof data.body_fat === 'string' ? parseFloat(data.body_fat) : data.body_fat
        if (data.goal !== undefined) detailsUpdate.goal = data.goal
        if (data.activity_level !== undefined) detailsUpdate.activity_level = data.activity_level
        if (data.observations !== undefined) detailsUpdate.observations = data.observations
        if (data.steroid_use !== undefined) detailsUpdate.steroid_use = data.steroid_use
        if (data.neck_cm !== undefined) detailsUpdate.neck_cm = typeof data.neck_cm === 'string' ? parseFloat(data.neck_cm) : data.neck_cm
        if (data.waist_cm !== undefined) detailsUpdate.waist_cm = typeof data.waist_cm === 'string' ? parseFloat(data.waist_cm) : data.waist_cm
        if (data.hip_cm !== undefined) detailsUpdate.hip_cm = typeof data.hip_cm === 'string' ? parseFloat(data.hip_cm) : data.hip_cm

        const { error: detailsError } = await supabase
            .from('student_details')
            .update(detailsUpdate)
            .eq('id', user.id)

        if (detailsError) throw detailsError

        // 3. Save History (optional logs)
        const historyPromises = []

        if (data.weight !== undefined) {
            const weightVal = typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight
            historyPromises.push(
                supabase.from('weight_history').insert({
                    student_id: user.id,
                    weight_kg: weightVal,
                    recorded_at: new Date().toISOString()
                })
            )
        }

        if (data.body_fat !== undefined) {
            const bfVal = typeof data.body_fat === 'string' ? parseFloat(data.body_fat) : data.body_fat
            historyPromises.push(
                supabase.from('bf_history').insert({
                    student_id: user.id,
                    bf_percentage: bfVal,
                    recorded_at: new Date().toISOString()
                })
            )
        }

        if (historyPromises.length > 0) {
            await Promise.all(historyPromises)
        }

        revalidatePath('/dashboard/student')
        revalidatePath('/dashboard/student/profile')
        revalidatePath('/dashboard/student/progress')
        
        return { success: true }
    } catch (e: any) {
        console.error('Error updating student profile:', e)
        return { success: false, error: e.message }
    }
}

export async function uploadAvatar(formData: FormData) {
    try {
        const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Usuário não autenticado' }
        const file = formData.get('file') as File
        if (!file) throw new Error('Nenhum arquivo enviado')

        // Safety check for file properties
        const originalName = file.name || 'avatar.jpg'
        const fileExt = originalName.split('.').pop() || 'jpg'
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        console.log(`Uploading avatar for student ${user.id} to ${filePath}...`)

        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (uploadError) {
            console.error('Storage upload error:', uploadError)
            return { success: false, error: `Erro no upload: ${uploadError.message}` }
        }

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        const publicUrl = data?.publicUrl

        if (!publicUrl) {
            throw new Error('Não foi possível gerar a URL pública da imagem')
        }

        console.log(`Avatar uploaded successfully. Public URL: ${publicUrl}`)

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id)

        if (profileError) {
            console.error('Profile update error:', profileError)
            return { success: false, error: `Erro ao atualizar perfil: ${profileError.message}` }
        }

        revalidatePath('/dashboard/student/profile')
        revalidatePath('/dashboard/student', 'layout')

        return { success: true, url: publicUrl }
    } catch (e: any) {
        console.error('Unexpected error in uploadAvatar:', e)
        return { success: false, error: e.message || 'Ocorreu um erro inesperado no processamento.' }
    }
}

export async function saveProgressPhotosMetadata(data: {
    urls: Record<string, string>,
    allowPublic: boolean
}) {
    try {
        const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Usuário não autenticado' }

        const { error: dbError } = await supabase
            .from('progress_photos')
            .insert({
                student_id: user.id,
                ...data.urls,
                is_private: !data.allowPublic,
                created_at: new Date().toISOString()
            })

        if (dbError) {
            console.error('Database error in saveProgressPhotosMetadata:', dbError)
            throw new Error(`Erro ao salvar no banco: ${dbError.message}`)
        }

        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        console.error('Unexpected error in saveProgressPhotosMetadata:', e)
        return { success: false, error: e.message || 'Erro ao registrar fotos.' }
    }
}

export async function uploadProgressPhotos(formData: FormData) {
    try {
        const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Usuário não autenticado' }

        // --- Monthly Photo Limit Check ---
        const { data: profile } = await supabase
            .from('profiles')
            .select('monthly_photo_count, last_photo_reset')
            .eq('id', user.id)
            .single()

        const now = new Date()
        const lastReset = profile?.last_photo_reset ? new Date(profile.last_photo_reset) : new Date(0)

        // Reset count if it's a new month
        let currentCount = profile?.monthly_photo_count || 0
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            currentCount = 0
            await supabase.from('profiles')
                .update({ monthly_photo_count: 0, last_photo_reset: now.toISOString() })
                .eq('id', user.id)
        }

        if (currentCount >= 4) {
            return { success: false, error: 'Você atingiu o limite de 4 atualizações de fotos este mês. Aguarde o próximo mês!' }
        }
        // ---------------------------------

        const photos = {
            front: formData.get('front') as File,
            back: formData.get('back') as File,
            side_left: formData.get('side_left') as File,
            side_right: formData.get('side_right') as File,
        }

        console.log(`Uploading progress photos for student ${user.id}...`)

        const urls: Record<string, string> = {}
        const timestamp = Date.now()

        for (const [key, file] of Object.entries(photos)) {
            if (file && file.size > 0) {
                const originalName = file.name || `${key}.jpg`
                const fileExt = originalName.split('.').pop() || 'jpg'
                const fileName = `${user.id}/${timestamp}-${key}.${fileExt}`
                const filePath = `progress-photos/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('progress-photos')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    })

                if (uploadError) {
                    console.error(`Error uploading ${key}:`, uploadError)
                    throw new Error(`Erro ao enviar foto (${key}): ${uploadError.message}`)
                }

                const { data } = supabase.storage
                    .from('progress-photos')
                    .getPublicUrl(filePath)

                if (!data?.publicUrl) {
                    throw new Error(`Erro ao gerar URL para ${key}`)
                }

                urls[`${key}_url`] = data.publicUrl
            }
        }

        const allowPublic = formData.get('allow_public') !== 'false'

        const { error: dbError } = await supabase
            .from('progress_photos')
            .insert({
                student_id: user.id,
                ...urls,
                is_private: !allowPublic,
                created_at: new Date().toISOString()
            })

        if (dbError) {
            console.error('Database error inserting progress photos:', dbError)
            throw new Error(`Erro ao salvar no banco: ${dbError.message}`)
        }

        // Increment count
        await supabase.from('profiles')
            .update({ monthly_photo_count: currentCount + 1 })
            .eq('id', user.id)

        console.log('Progress photos uploaded successfully.')
        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        console.error('Unexpected error in uploadProgressPhotos:', e)
        return { success: false, error: e.message || 'Erro inesperado no processamento das fotos.' }
    }
}

export async function deleteProgressPhoto(photoId: string) {
    try {
        const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Não autorizado' }

        const { data: photo, error: fetchError } = await supabase
            .from('progress_photos')
            .select('student_id, front_url, back_url, side_left_url, side_right_url')
            .eq('id', photoId)
            .single()

        if (fetchError || !photo) {
            // Idempotency: If already gone, it's a success
            return { success: true, message: 'Foto já removida' }
        }

        // Check ownership - strictly restricted to student as requested
        if (photo.student_id !== user.id) {
            return { success: false, error: 'Não autorizado para remover esta foto.' }
        }

        const { data: trainerLink } = await supabase
            .from('trainer_students')
            .select('id')
            .eq('student_id', photo.student_id)
            .eq('active', true)
            .maybeSingle()

        // Delete files from storage
        const urls = [photo.front_url, photo.back_url, photo.side_left_url, photo.side_right_url]
            .filter(Boolean) as string[]

        for (const url of urls) {
            // Extract path after /progress-photos/
            const parts = url.split('/progress-photos/')
            if (parts.length > 1) {
                const path = parts[1]
                await supabase.storage
                    .from('progress-photos')
                    .remove([path])
            }
        }

        // Delete the database record
        const { error: deleteError } = await supabase
            .from('progress_photos')
            .delete()
            .eq('id', photoId)

        if (deleteError) {
            console.error('Database error deleting progress photo:', deleteError)
            throw new Error(`Erro ao remover do banco: ${deleteError.message}`)
        }

        revalidatePath('/dashboard/student/progress')
        revalidatePath(`/dashboard/trainer/students/${trainerLink?.id || ''}`)
        return { success: true }
    } catch (e: any) {
        console.error('Unexpected error in deleteProgressPhoto:', e)
        return { success: false, error: e.message || 'Erro inesperado ao excluir foto.' }
    }
}

export async function submitTrainerReview(data: {
    trainer_id: string,
    rating: number,
    comment?: string
}) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    try {
        const { error } = await supabase
            .from('trainer_reviews')
            .upsert({
                student_id: user.id,
                trainer_id: data.trainer_id,
                rating: data.rating,
                comment: data.comment,
                created_at: new Date().toISOString()
            }, {
                onConflict: 'student_id, trainer_id'
            })

        if (error) throw error

        revalidatePath('/dashboard/student/meu-personal')
        revalidatePath('/buscar-personal')
        return { success: true }
    } catch (e: any) {
        console.error('Error submitting review:', e)
        return { success: false, error: e.message }
    }
}

export async function updateProgressPhotoDate(photoId: string, newDate: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // Find photo to check student_id
        const { data: photo } = await supabase
            .from('progress_photos')
            .select('student_id')
            .eq('id', photoId)
            .single()

        if (!photo) return { success: false, error: 'Foto não encontrada' }

        // Check ownership - strictly restricted to student as requested
        if (photo.student_id !== user.id) {
            return { success: false, error: 'Não autorizado para editar esta foto.' }
        }

        const { data: trainerLink } = await supabase
            .from('trainer_students')
            .select('id')
            .eq('student_id', photo.student_id)
            .maybeSingle()

        const { error } = await supabase
            .from('progress_photos')
            .update({ created_at: newDate })
            .eq('id', photoId)

        if (error) {
            console.error('Database error in updateProgressPhotoDate:', error)
            throw new Error(`Erro ao atualizar data: ${error.message}`)
        }

        revalidatePath('/dashboard/student/progress')
        revalidatePath(`/dashboard/trainer/students/${trainerLink?.id || ''}`)
        return { success: true }
    } catch (e: any) {
        console.error('Unexpected error in updateProgressPhotoDate:', e)
        return { success: false, error: e.message || 'Erro inesperado ao atualizar data.' }
    }
}

// Redundant updateStudentProfile removed and consolidated at line 283

export async function getPublicStudentProfile(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        // Fetch all student profile data in parallel
        const [
            { data: profile, error: profileErr },
            { data: trainerLink },
            { data: photos },
            { data: details }
        ] = await Promise.all([
            supabase
                .from('profiles')
                .select(`
                    id, full_name, avatar_url, allow_public_feed, public_profile_enabled,
                    auto_training_status, auto_training_trial_end, created_at
                `)
                .eq('id', studentId)
                .single(),
            supabase
                .from('trainer_students')
                .select(`
                    active,
                    trainer:profiles!trainer_id(
                        id, full_name, avatar_url, trainer_code
                    )
                `)
                .eq('student_id', studentId)
                .eq('active', true)
                .maybeSingle(),
            supabase
                .from('progress_photos')
                .select('*')
                .eq('student_id', studentId)
                .eq('is_private', false)
                .order('created_at', { ascending: false }),
            supabase
                .from('student_details')
                .select('body_fat, steroid_use, image_publication_authorized')
                .eq('id', studentId)
                .single()
        ])

        if (profileErr || !profile) throw new Error('Student not found')

        const oldestPhoto = photos && photos.length > 0 ? photos[photos.length - 1] : null;
        const newestPhoto = photos && photos.length > 0 ? photos[0] : null;

        // Fetch adherence history separately (it's also an async import/call)
        const { getStudentAdherenceHistory } = await import('./tracking-actions')
        const adherenceHistory = await getStudentAdherenceHistory(studentId, 30)

        return {
            profile,
            details,
            hasTrainer: !!trainerLink,
            trainer: trainerLink?.trainer,
            photos: photos || [],
            adherenceHistory: adherenceHistory || [],
            beforeAfter: {
                before: oldestPhoto,
                after: newestPhoto
            }
        }
    } catch (e) {
        console.error('Error in getPublicStudentProfile:', e)
        return null
    }
}


export async function getProgressPhotos(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data, error } = await supabase
        .from('progress_photos')
        .select('id, front_url, back_url, side_right_url, side_left_url, created_at, is_private')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
}

export async function getStudentDetails(userId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data, error } = await supabase
        .from('student_details')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
    
    if (error) throw error
    return data
}

export async function getPublicFeed() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('progress_photos')
            .select(`
                id,
                front_url,
                side_right_url,
                back_url,
                created_at,
                student_id,
                profiles!inner (
                    full_name,
                    avatar_url,
                    allow_public_feed,
                    allow_image_disclosure
                )
            `)
            .eq('is_private', false)
            .or('allow_public_feed.eq.true,allow_image_disclosure.eq.true', { foreignTable: 'profiles' })
            .order('created_at', { ascending: false })
            .limit(30)

        if (error) throw error

        const studentPhotos = new Map<string, any>()
        if (data) {
            data.forEach((p: any) => {
                if (!studentPhotos.has(p.student_id)) {
                    studentPhotos.set(p.student_id, {
                        ...p,
                        student: p.profiles
                    })
                }
            })
        }

        return { success: true, data: Array.from(studentPhotos.values()) }
    } catch (e: any) {
        console.error('Error fetching public feed:', e)
        return { success: false, error: e.message }
    }
}
