
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubjlkztymdaggikvzsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Ympsa3p0eW1kYWdnaWt2enN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODU5MDMsImV4cCI6MjA4Njg2MTkwM30.CWgeiRIGrpCYdGcxK6npcv3PP3RkRC3Cz4Bpwr7DRFA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
    console.log('--- LINK AUDIT ---')

    const { data: links, error } = await supabase
        .from('trainer_students')
        .select(`
            trainer:profiles!trainer_id(full_name),
            student:profiles!student_id(full_name)
        `)

    if (error) {
        console.log('ERROR:', error)
    } else {
        console.log(JSON.stringify(links, null, 2))
    }
}

debug()
