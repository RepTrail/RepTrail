
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

const supabase = createClient(
    env['NEXT_PUBLIC_SUPABASE_URL'],
    env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
)

async function debug() {
    console.log("Checking pending_student_links...")
    const { data, error } = await supabase.from('pending_student_links').select('*')
    
    if (error) {
        console.error("Error fetching pending_student_links:", error.message)
        if (error.message.includes("does not exist")) {
            console.log("TABLE DOES NOT EXIST!")
        }
    } else {
        console.log(`Found ${data?.length || 0} records.`)
        console.log(JSON.stringify(data, null, 2))
    }
}

debug()
