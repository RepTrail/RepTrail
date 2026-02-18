
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubjlkztymdaggikvzsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Ympsa3p0eW1kYWdnaWt2enN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODU5MDMsImV4cCI6MjA4Njg2MTkwM30.CWgeiRIGrpCYdGcxK6npcv3PP3RkRC3Cz4Bpwr7DRFA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
    console.log('--- STARTING DIAGNOSTIC ---')

    // 1. Fetch all profiles to see what's there
    const { data: allProfiles, error: allErr } = await supabase
        .from('profiles')
        .select('id, full_name, role, email')

    console.log('ALL PROFILES:', allProfiles?.length || 0)
    console.log(JSON.stringify(allProfiles, null, 2))

    // 2. specifically check for role = 'trainer'
    const { data: trainers, error: trainerErr } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', 'trainer')

    console.log('--- TRAINERS FOUND ---')
    console.log(JSON.stringify(trainers, null, 2))
}

debug()
