
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('email', 'personal@reptrail.com.br')
        .maybeSingle();
    
    console.log('Trainer Profile:', profile);
}

run();
