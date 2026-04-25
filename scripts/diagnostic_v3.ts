
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubjlkztymdaggikvzsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Ympsa3p0eW1kYWdnaWt2enN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODU5MDMsImV4cCI6MjA4Njg2MTkwM30.CWgeiRIGrpCYdGcxK6npcv3PP3RkRC3Cz4Bpwr7DRFA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable(tableName: string) {
    console.log(`--- CHECKING ${tableName.toUpperCase()} COLUMNS ---`)
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

    if (error) {
        console.log(`ERROR ${tableName}:`, error.message)
    } else if (data && data.length > 0) {
        console.log(`COLUMNS FOUND IN ${tableName}:`, Object.keys(data[0]).join(', '))
    } else {
        console.log(`No data found in ${tableName} table.`)
    }
}

async function debug() {
    await checkTable('profiles')
    await checkTable('student_details')
    await checkTable('trainer_students')
    await checkTable('workout_logs')
    await checkTable('load_history')
}

debug()
