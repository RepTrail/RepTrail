import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase config')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
    console.log('--- DEBUG START ---')

    // 1. Find Marcos
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', '%Marcos%')
        .single()

    if (!profile) {
        console.log('Marcos not found')
        return
    }

    console.log('Profile found:', profile)
    const userId = profile.id

    // 2. Check Workout Logs for today
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const { data: workoutLogs } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('student_id', userId)
        .gte('started_at', start.toISOString())
        .lte('started_at', end.toISOString())

    console.log('Workout logs today:', workoutLogs)

    // 3. Check Cardio Assignments
    const { data: cardioAssignments } = await supabase
        .from('assigned_cardios')
        .select('*, cardio:cardios(*)')
        .eq('student_id', userId)
        .eq('active', true)

    console.log('Active Cardio Assignments:', JSON.stringify(cardioAssignments, null, 2))

    // 4. Check Cardio Logs for today
    const { data: cardioLogs } = await supabase
        .from('cardio_logs')
        .select('*')
        .eq('student_id', userId)
        .gte('started_at', start.toISOString())
        .lte('started_at', end.toISOString())

    console.log('Cardio logs today:', cardioLogs)

    console.log('--- DEBUG END ---')
}

debug()
