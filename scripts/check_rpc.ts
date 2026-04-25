
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkRpc() {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('Checking for execute_sql RPC...')
    const { data, error } = await supabase.rpc('execute_sql', { sql_query: 'SELECT 1' })
    
    if (error) {
        console.error('RPC execute_sql NOT FOUND or error:', error.message)
    } else {
        console.log('RPC execute_sql FOUND!', data)
    }
}

checkRpc()
