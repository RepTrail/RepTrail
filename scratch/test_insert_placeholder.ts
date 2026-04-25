
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

// USE SERVICE ROLE KEY if available to bypass RLS for debug
const supabase = createClient(
    env['NEXT_PUBLIC_SUPABASE_URL'],
    env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
)

async function debug() {
    // 1. Get a trainer ID
    const { data: trainers } = await supabase.from('profiles').select('id').eq('role', 'trainer').limit(1)
    if (!trainers?.length) {
        console.log("No trainers found to test.")
        return
    }
    const trainerId = trainers[0].id
    console.log("Testing with trainer:", trainerId)

    // 2. Try to insert
    console.log("Inserting placeholder...")
    const { data, error } = await supabase.from('pending_student_links').insert({
        trainer_id: trainerId,
        student_name: "TEST PLACEHOLDER " + new Date().getTime(),
        student_email: "test@placeholder.com",
        status: 'pending'
    }).select()

    if (error) {
        console.error("Insert Error:", error.message)
    } else {
        console.log("Inserted successfully:", data[0].id)
    }

    // 3. Try to select back
    const { data: list, error: listError } = await supabase.from('pending_student_links').select('*').eq('trainer_id', trainerId)
    console.log(`Select result: ${list?.length || 0} records.`)
}

debug()
