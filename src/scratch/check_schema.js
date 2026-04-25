
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkTrainerStudentsSchema() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
        .from('trainer_students')
        .select('*')
        .limit(1);

    if (error) console.error('Error:', error);
    console.log('Sample Data from trainer_students:', data?.[0]);
}

checkTrainerStudentsSchema();
