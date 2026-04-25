
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkForeignKeys() {
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('--- Checking Foreign Keys for profiles, assigned_workouts, assigned_diets ---')
    
    const query = `
        SELECT
            tc.table_schema, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND tc.table_name IN ('profiles', 'assigned_workouts', 'assigned_diets', 'trainer_students');
    `;

    const { data, error } = await supabase.rpc('execute_sql', { sql_query: query })

    if (error) {
        console.error('Error executing query via RPC:', error)
        // If execute_sql RPC doesn't exist, we might not be able to do this easily without psql
        console.log('Falling back to direct table structure check...')
        
        const tables = ['profiles', 'assigned_workouts', 'assigned_diets', 'trainer_students']
        for (const table of tables) {
            const { data: record } = await supabase.from(table).select('*').limit(1)
            console.log(`Columns in ${table}:`, record ? Object.keys(record[0] || {}) : 'No data')
        }
    } else {
        console.table(data)
    }
}

checkForeignKeys()
