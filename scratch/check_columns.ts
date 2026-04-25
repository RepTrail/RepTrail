
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) env[key.trim()] = value.trim()
})

// USE SERVICE ROLE to check schema
const supabase = createClient(
    env['NEXT_PUBLIC_SUPABASE_URL'],
    env['SUPABASE_SERVICE_ROLE_KEY']
)

async function checkSchema() {
    console.log("Inspecting pending_student_links table...")
    
    // We can't use standard postgres queries via the client easily without an RPC, 
    // but we can try to get column names by selecting 1 row.
    const { data, error } = await supabase.from('pending_student_links').select('*').limit(1)
    
    if (error) {
        console.error("Error:", error.message)
    } else {
        console.log("Columns:", Object.keys(data[0] || {}))
    }

    // Try to find foreign keys via a raw query if we have an RPC like 'exec_sql' (often used in these projects)
    // But I don't know if it exists.
}

checkSchema()
