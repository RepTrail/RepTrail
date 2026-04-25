
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) env[key.trim()] = value.trim()
})

const supabase = createClient(
    env['NEXT_PUBLIC_SUPABASE_URL'],
    env['SUPABASE_SERVICE_ROLE_KEY']
)

async function debug() {
    console.log("Fetching ALL pending links...")
    const { data, error } = await supabase.from('pending_student_links').select('*')
    
    if (error) {
        console.error("Error:", error.message)
    } else {
        console.log(`Found ${data?.length || 0} records.`)
        data?.forEach(r => {
            console.log(`- ID: ${r.id}, Name: ${r.student_name}, Workouts: ${r.workout_ids?.length || 0}, Status: ${r.status}`)
        })
    }
}

debug()
