
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

async function debug() {
    if (!url || !key) {
        console.error('Missing URL or Key', { url: !!url, key: !!key })
        return
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } })

    console.log('Testing queries...')

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name')
            .limit(1)
        
        if (error) {
            console.error('Error fetching profile:', error)
        } else {
            console.log('Success fetching profile:', data)
        }
    } catch (e) {
        console.error('Exception in profile query:', e)
    }

    try {
        const { data: workouts, error: wError } = await supabase
            .from('workouts')
            .select('count')
        
        if (wError) {
            console.error('Error fetching workouts:', wError)
        } else {
            console.log('Success fetching workouts count:', workouts)
        }
    } catch (e) {
        console.error('Exception in workout query:', e)
    }
}

debug()
