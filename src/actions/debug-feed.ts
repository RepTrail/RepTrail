import { createClient } from '@/lib/supabase/server'

export async function debugFeedQuery() {
    const supabase = await createClient()

    // Test 1: Count total photos
    const { count: total, error: countErr } = await supabase
        .from('progress_photos')
        .select('*', { count: 'exact', head: true })

    // Test 2: Try simple select
    const { data: raw, error: rawErr } = await supabase
        .from('progress_photos')
        .select('id, is_private, student_id')
        .limit(5)

    // Test 3: Check profiles opt-in
    const { data: optInCount } = await supabase
        .from('profiles')
        .select('id')
        .eq('allow_public_feed', true)
        .limit(5)

    return { total, countErr, raw, rawErr, optInCount }
}
