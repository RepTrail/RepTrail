import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function checkProfiles() {
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, is_placeholder, role')
        .order('created_at', { ascending: false })
        .limit(10)
    console.log("Recent profiles:", profiles)

    const { data: ts } = await supabase
        .from('trainer_students')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
    console.log("Recent trainer_students:", ts)
}
checkProfiles()
