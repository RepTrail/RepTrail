
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubjlkztymdaggikvzsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Ympsa3p0eW1kYWdnaWt2enN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODU5MDMsImV4cCI6MjA4Njg2MTkwM30.CWgeiRIGrpCYdGcxK6npcv3PP3RkRC3Cz4Bpwr7DRFA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
    console.log('--- DATABASE DIAGNOSTIC V5 ---')

    // 1. Get all profiles with their roles (no filter)
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, email')
        .limit(10)

    if (error) {
        console.log('Error fetching profiles:', error)
    } else {
        console.log('Profiles found:', profiles?.length || 0)
        console.log(JSON.stringify(profiles, null, 2))

        const roles = [...new Set(profiles?.map(p => p.role))]
        console.log('Unique roles found in DB:', roles)
    }

    // 2. Try the RPC again 
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_trainer_ranking_stats')
    console.log('RPC result count:', rpcData?.length || 0)
    if (rpcErr) console.log('RPC Error:', rpcErr)
}

debug()
