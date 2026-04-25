
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubjlkztymdaggikvzsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Ympsa3p0eW1kYWdnaWt2enN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODU5MDMsImV4cCI6MjA4Njg2MTkwM30.CWgeiRIGrpCYdGcxK6npcv3PP3RkRC3Cz4Bpwr7DRFA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
    console.log('--- DATABASE DIAGNOSTIC V4 ---')

    // 1. Check profiles count
    const { count, error: countErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    console.log('Total profiles:', count, countErr || '')

    // 2. List all trainers
    const { data: trainers, error: trainerErr } = await supabase
        .from('profiles')
        .select('id, full_name, role, plan_tier, elite_until')
        .eq('role', 'trainer')

    console.log('Trainers found:', trainers?.length || 0)
    console.log(JSON.stringify(trainers, null, 2))

    // 3. Check for any profile that might be missing role
    const { data: nullRoles } = await supabase
        .from('profiles')
        .select('id, email, role')
        .is('role', null)

    if (nullRoles && nullRoles.length > 0) {
        console.log('Profiles with NULL role:', nullRoles.length)
        console.log(nullRoles)
    }

    // 4. Test RPC explicitly
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_trainer_ranking_stats')
    console.log('RPC Test result:', rpcErr ? 'FAILED' : 'SUCCESS')
    if (rpcErr) console.log('RPC Error details:', rpcErr)
}

debug()
