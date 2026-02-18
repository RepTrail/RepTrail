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
        query = query.order('retention_rate', { ascending: false })
    } else {
        // Default: Elite first, then rating
        query = query.order('is_elite', { ascending: false }).order('average_rating', { ascending: false })
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
                goal: data.goal,
                activity_level: data.activity_level,
                observations: data.observations,
                steroid_use: data.steroid_use,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (detailsError) throw detailsError

        revalidatePath('/dashboard/student/profile')
        return { success: true }
    } catch (e: any) {
        console.error('Error updating profile:', e)
        return { success: false, error: e.message }
    }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    try {
        const file = formData.get('file') as File
        if (!file) throw new Error('No file provided')

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } = { publicUrl: '' } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id)

        if (profileError) throw profileError

        revalidatePath('/dashboard/student/profile')
        revalidatePath('/dashboard', 'layout')
        return { success: true, url: publicUrl }
    } catch (e: any) {
        console.error('Error uploading avatar:', e)
        return { success: false, error: e.message }
    }
}

export async function uploadProgressPhotos(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    try {
        const photos = {
            front: formData.get('front') as File,
            back: formData.get('back') as File,
            side_left: formData.get('side_left') as File,
            side_right: formData.get('side_right') as File,
        }

        const urls: any = {}

        for (const [key, file] of Object.entries(photos)) {
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${user.id}-${key}-${Date.now()}.${fileExt}`
                const filePath = `progress-photos/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('progress-photos')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } = { publicUrl: '' } } = supabase.storage
                    .from('progress-photos')
                    .getPublicUrl(filePath)

                urls[`${key}_url`] = publicUrl
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

        if (dbError) throw dbError

        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        console.error('Error uploading progress photos:', e)
        return { success: false, error: e.message }
    }
}

export async function deleteProgressPhoto(photoId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    try {
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
            const path = url.split('/progress-photos/')[1]
            if (path) {
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

        if (deleteError) throw deleteError

        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        console.error('Error deleting progress photo:', e)
        return { success: false, error: e.message }
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
