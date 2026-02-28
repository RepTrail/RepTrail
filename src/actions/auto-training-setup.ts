import { createClient } from '@/lib/supabase/server'

export async function setupAutoTrainingForStudent(studentId: string, profileData: any) {
    const supabase = await createClient()

    try {
        // 1. Mark profile with public feed permission if requested during onboarding
        // The `image_publication_authorized` flag maps to `allow_public_feed` in profiles
        if (profileData.imageAuth) {
            await supabase
                .from('profiles')
                .update({ allow_public_feed: true })
                .eq('id', studentId)
        }

        console.log(`Auto Training setup completed for student ${studentId}`)
        return { success: true }
    } catch (e) {
        console.error('Failed to setup auto training environment:', e)
        return { success: false }
    }
}
