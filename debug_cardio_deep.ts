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
    const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a'
    console.log(`--- DEBUG START FOR STUDENT: ${studentId} ---`)

    // 1. Check direct table content (without joins or active filter)
    const { data: raw, error: rawErr } = await supabase
        .from('assigned_cardios')
        .select('*')
        .eq('student_id', studentId)

    console.log('1. Raw assigned_cardios (no filters):', raw)
    if (rawErr) console.error('Error 1:', rawErr)

    // 2. Check if the cardios exist
    if (raw && raw.length > 0) {
        const cardioIds = raw.map(r => r.cardio_id)
        const { data: cardios, error: cErr } = await supabase
            .from('cardios')
            .select('*')
            .in('id', cardioIds)
        console.log('2. Referenced cardios in "cardios" table:', cardios)
        if (cErr) console.error('Error 2:', cErr)
    } else {
        console.log('2. No cardio IDs to check.')
    }

    // 3. Check Trainer Relationship
    const { data: rel, error: relErr } = await supabase
        .from('trainer_students')
        .select('*')
        .eq('student_id', studentId)
        .eq('active', true)
    console.log('3. Active Trainer Relationship:', rel)
    if (relErr) console.error('Error 3:', relErr)

    // 4. Check if student profile exists
    const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .single()
    console.log('4. Profile:', profile)
    if (pErr) console.error('Error 4:', pErr)

    console.log('--- DEBUG END ---')
}

debug()
