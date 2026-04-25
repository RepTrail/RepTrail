
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Checking assignments with profile data...');
    const { data, error } = await supabase
        .from('workouts')
        .select(`
            id,
            name,
            assignments:assigned_workouts(
                id,
                student_id,
                day_of_week,
                active,
                student:profiles(full_name)
            )
        `)
        .eq('name', 'TREINO C');
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Results:');
    console.log(JSON.stringify(data, null, 2));
}

run();
