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
        whatsapp?: string
    }
) {
    const supabase = await createClient()

    try {
        // Update WhatsApp in profiles table if provided
        if (data.whatsapp !== undefined) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ whatsapp: data.whatsapp })
                .eq('id', studentId)

            if (profileError) {
                console.error('Error updating student whatsapp in profiles:', profileError)
                // We don't necessarily want to block the whole update if this fails due to RLS, 
                // but let's see. For now, let's keep it simple.
            }
        }

        // Update physical data
        if (data.weight !== undefined || data.body_fat !== undefined) {
            const { error: detailsError } = await supabase
                .from('student_details')
                .update({
                    starting_weight: data.weight,
                    body_fat: data.body_fat,
                    steroid_use: data.steroid_use,
                    updated_at: new Date().toISOString()
                })
                .eq('id', studentId)

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

            // Save BF History
            if (data.body_fat !== undefined) {
                try {
                    await supabase.from('bf_history').insert({
                        student_id: studentId,
                        bf_percentage: data.body_fat,
                        recorded_at: new Date().toISOString()
                    })
                } catch (e) {
                    // This will fail if table doesn't exist yet
                    console.error('Error saving BF history:', e)
                }
            }
        }

        // Update financial data
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
        return { success: true }
    } catch (error: any) {
        console.error('Error updating student data:', error)
        return { success: false, error: error.message }
    }
}

export async function markPaymentAsReceived(studentId: string, trainerId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('trainer_students')
            .update({
                last_payment_date: new Date().toISOString()
            })
            .eq('trainer_id', trainerId)
            .eq('student_id', studentId)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/students/${studentId}`)
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
                    instagram
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
    const supabase = await createClient()
    let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer')

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

    const { data, error } = await query.limit(20)

    if (error) {
        console.error('Supabase Error:', error)
        return []
    }

    console.log('Results Count:', data?.length || 0)
    if (data && data.length > 0) {
        console.log('Sample Result Name:', data[0].full_name)
    }
    console.log('-----------------------------')
    return data || []
}

export async function getTrainerByCode(code: string) {
    const supabase = await createClient()

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
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', studentId)
            .single()

        if (profileError) throw profileError

        const { data: details, error: detailsError } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', studentId)
            .single()

        if (detailsError && detailsError.code !== 'PGRST116') throw detailsError

        return { ...profile, details }
    } catch (e) {
        console.error('Error fetching student profile:', e)
        return null
    }
}

export async function updateStudentFullProfile(data: {
    full_name?: string
    birth_date?: string
    height?: number
    body_fat?: number
    goal?: string
    activity_level?: string
    observations?: string
    steroid_use?: boolean
    whatsapp?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    try {
        // Update profile
        if (data.full_name || data.whatsapp) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    whatsapp: data.whatsapp
                })
                .eq('id', user.id)
            if (profileError) throw profileError
        }

        // Update student details
        const { error: detailsError } = await supabase
            .from('student_details')
            .update({
                birth_date: data.birth_date,
                height: data.height,
                body_fat: data.body_fat,
                goal: data.goal,
                activity_level: data.activity_level,
                observations: data.observations,
                steroid_use: data.steroid_use,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (detailsError) throw detailsError

        // Save BF History if provided
        if (data.body_fat !== undefined) {
            try {
                await supabase.from('bf_history').insert({
                    student_id: user.id,
                    bf_percentage: data.body_fat,
                    recorded_at: new Date().toISOString()
                })
            } catch (e) {
                console.error('Error saving BF history:', e)
            }
        }

        revalidatePath('/dashboard/student/profile')
        return { success: true }
    } catch (e: any) {
        console.error('Error updating profile:', e)
        return { success: false, error: e.message }
    }
}

export async function uploadAvatar(formData: FormData) {
    try {
        const supabase = await createClient()
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
        const supabase = await createClient()
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
        const supabase = await createClient()
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
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Não autorizado' }

        // First, get the photo record to delete the files from storage
        const { data: photo, error: fetchError } = await supabase
            .from('progress_photos')
            .select('front_url, back_url, side_left_url, side_right_url')
            .eq('id', photoId)
            .eq('student_id', user.id)
            .single()

        if (fetchError || !photo) {
            return { success: false, error: 'Foto não encontrada' }
        }

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
            .eq('student_id', user.id)

        if (deleteError) {
            console.error('Database error deleting progress photo:', deleteError)
            throw new Error(`Erro ao remover do banco: ${deleteError.message}`)
        }

        revalidatePath('/dashboard/student/progress')
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
    const supabase = await createClient()
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const { error } = await supabase
            .from('progress_photos')
            .update({ created_at: newDate })
            .eq('id', photoId)
            .eq('student_id', user.id)

        if (error) {
            console.error('Database error in updateProgressPhotoDate:', error)
            throw new Error(`Erro ao atualizar data: ${error.message}`)
        }

        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        console.error('Unexpected error in updateProgressPhotoDate:', e)
        return { success: false, error: e.message || 'Erro inesperado ao atualizar data.' }
    }
}

export async function updateStudentProfile(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Não autorizado' }

    try {
        const { error: detailError } = await supabase
            .from('student_details')
            .update({
                age: data.age ? parseInt(data.age) : undefined,
                sex: data.sex,
                height: data.height ? parseFloat(data.height) : undefined,
                activity_level: data.activity_level,
                current_weight: data.weight ? parseFloat(data.weight) : undefined,
                body_fat: data.body_fat ? parseFloat(data.body_fat) : undefined,
                neck_cm: data.neck_cm ? parseFloat(data.neck_cm) : undefined,
                waist_cm: data.waist_cm ? parseFloat(data.waist_cm) : undefined,
                hip_cm: data.hip_cm ? parseFloat(data.hip_cm) : undefined,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (detailError) throw detailError

        // Save Weight History
        if (data.weight) {
            await supabase.from('weight_history').insert({
                student_id: user.id,
                weight_kg: parseFloat(data.weight),
                recorded_at: new Date().toISOString()
            })
        }

        // Save BF History
        if (data.body_fat) {
            await supabase.from('bf_history').insert({
                student_id: user.id,
                bf_percentage: parseFloat(data.body_fat),
                recorded_at: new Date().toISOString()
            })
        }

        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        console.error('Error updating student profile:', e)
        return { success: false, error: e.message }
    }
}

export async function getPublicStudentProfile(studentId: string) {
    const supabase = await createClient()

    try {
        // 1. Basic Profile & Details (Basic safety: only if public_profile_enabled or similar if we had it, but for now we follow feed rules)
        const { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select(`
                id, full_name, avatar_url, allow_public_feed, public_profile_enabled,
                auto_training_status, auto_training_trial_end, created_at
            `)
            .eq('id', studentId)
            .single()

        if (profileErr || !profile) throw new Error('Student not found')

        // 2. Check for Trainer
        const { data: trainerLink } = await supabase
            .from('trainer_students')
            .select(`
                active,
                trainer:profiles!trainer_id(
                    id, full_name, avatar_url, trainer_code
                )
            `)
            .eq('student_id', studentId)
            .eq('active', true)
            .maybeSingle()

        // 3. Photos (All public ones)
        const { data: photos } = await supabase
            .from('progress_photos')
            .select('*')
            .eq('student_id', studentId)
            .eq('is_private', false)
            .order('created_at', { ascending: false })

        // 4. First and Last for "Before & After"
        const oldestPhoto = photos && photos.length > 0 ? photos[photos.length - 1] : null;
        const newestPhoto = photos && photos.length > 0 ? photos[0] : null;

        // 5. Adherence History (imported from tracking-actions)
        // We'll import it dynamically or just call the function if it's in the same project
        // Since it's a server action, we can import it.
        const { getStudentAdherenceHistory } = await import('./tracking-actions')
        const adherenceHistory = await getStudentAdherenceHistory(studentId, 30)

        // 6. Student Details (for steroid use flag)
        const { data: details } = await supabase
            .from('student_details')
            .select('body_fat, steroid_use, image_publication_authorized')
            .eq('id', studentId)
            .single()

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
