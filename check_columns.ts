
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubjlkztymdaggikvzsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Ympsa3p0eW1kYWdnaWt2enN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODU5MDMsImV4cCI6MjA4Njg2MTkwM30.CWgeiRIGrpCYdGcxK6npcv3PP3RkRC3Cz4Bpwr7DRFA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
    console.log('--- CHECKING PROFILES COLUMNS ---')

    // Attempt to fetch one row with all columns
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

    if (error) {
        console.log('ERROR:', error)
    } else if (data && data.length > 0) {
        console.log('COLUMNS FOUND:', Object.keys(data[0]).join(', '))
    } else {
        console.log('No data found in profiles table.')
    }
}

debug()
