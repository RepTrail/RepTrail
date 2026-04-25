
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkColumns() {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const tables = ['assigned_workouts', 'assigned_diets', 'trainer_students', 'pending_student_links']
    
    for (const table of tables) {
        console.log(`--- CHECKING ${table.toUpperCase()} COLUMNS ---`)
        const { data: record, error } = await supabase.from(table).select('*').limit(1).maybeSingle()
        if (error && error.code !== 'PGRST116') {
             console.error(`Error fetching from ${table}:`, error.message)
             continue
        }
        if (record) {
            console.log(`COLUMNS FOUND for ${table}:`, Object.keys(record))
        } else {
            // Try fetching with just limit 1 if no records exist
            const { data: records } = await supabase.from(table).select('*').limit(1)
            if (records && records.length > 0) {
                 console.log(`COLUMNS FOUND for ${table}:`, Object.keys(records[0]))
            } else {
                 console.log(`No records found in ${table} to detect columns.`)
            }
        }
    }
}

checkColumns()
