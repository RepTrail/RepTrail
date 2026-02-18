
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkSchema() {
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('--- Profiles Table Structure ---')
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'profiles' })

    if (error) {
        // If RPC doesn't exist, try a direct query to one record
        const { data: record, error: recordError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1)
            .single()

        if (recordError) {
            console.error('Error fetching record:', recordError)
        } else {
            console.log('Columns in profiles:', Object.keys(record))
            console.log('Sample record:', record)
        }
    } else {
        console.log('Columns:', data)
    }
}

checkSchema()
