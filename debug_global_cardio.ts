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
    console.log('--- GLOBAL CARDIO DEBUG ---')

    // 1. Total assigned cardios
    const { count: total, error: countErr } = await supabase
        .from('assigned_cardios')
        .select('*', { count: 'exact', head: true })
    console.log('Total assigned_cardios in DB:', total)

    // 2. Recent assigned cardios
    const { data: recent, error: recentErr } = await supabase
        .from('assigned_cardios')
        .select(`
            *,
            student:profiles!student_id(id, full_name),
            cardio:cardios(id, name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    console.log('Recent 5 assignments:', JSON.stringify(recent, null, 2))

    // 3. Search for profile "Marcos"
    const { data: marcosProfiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .ilike('full_name', '%Marcos%')
    console.log('Profiles matching "Marcos":', marcosProfiles)

    // 4. Check for student ID 812c9f7a-39e1-43aa-acdd-abe9dbdf189a
    const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a'
    const { data: specific, error: sErr } = await supabase
        .from('assigned_cardios')
        .select('*')
        .eq('student_id', studentId)
    console.log(`Assignments for ${studentId}:`, specific)

    console.log('--- END ---')
}

debug()
