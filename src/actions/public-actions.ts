'use server'

import { createClient } from '@/lib/supabase/server'

export type TrainerSearchResult = {
    id: string
    full_name: string
    avatar_url: string | null
    bio: string | null
    plan_tier: string
    trainer_code: string | null
    specialties: string[] | null
    average_rating: number
    instagram: string | null
}

export async function searchTrainers(query: string): Promise<TrainerSearchResult[]> {
    const supabase = await createClient()

    if (!query || query.length < 2) return []

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
            bio,
            plan_tier,
            trainer_code,
            specialties,
            average_rating,
            instagram
        `)
        .eq('role', 'trainer')
        .ilike('full_name', `%${query}%`)
        .limit(10)

    if (error) {
        console.error('Error searching trainers:', error)
        return []
    }

    return data as TrainerSearchResult[]
}
