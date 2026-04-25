
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function findStudent() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log(`--- Searching for student "Marcos Vinicius" ---`);

    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', '%Marcos Vinicius%');

    console.log('Profiles found:', profiles);
}

findStudent();
