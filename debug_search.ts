import { createClient } from './src/lib/supabase/server'

async function debug() {
    const supabase = await createClient()
    const { data: trainers, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, specialty')
        .ilike('full_name', '%Marcos%')

    console.log('Results for Marcos:', JSON.stringify(trainers, null, 2))

    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'trainer')

    console.log('Total trainers in DB:', count)
}

debug()
