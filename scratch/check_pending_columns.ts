
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
    const { data, error } = await supabase.from('pending_student_links').select('*').limit(1)
    if (error) {
        console.error("Error:", error)
        return
    }
    if (data && data.length > 0) {
        console.log("Columns found:", Object.keys(data[0]))
    } else {
        console.log("No data found in pending_student_links to inspect columns.")
        // Try to insert and rollback? Or just check types?
        // Let's try to get one even if status is not pending
        const { data: all } = await supabase.from('pending_student_links').select('*').limit(1)
        if (all && all.length > 0) {
             console.log("Columns found (from all):", Object.keys(all[0]))
        } else {
            console.log("Table is empty.")
        }
    }
}

check()
