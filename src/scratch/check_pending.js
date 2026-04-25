
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkPending() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const relationshipId = 'b9a0967e-f04a-4598-a6d9-7227af9f0038';
    
    const { data: pending } = await supabase
        .from('pending_student_links')
        .select('*')
        .eq('id', relationshipId)
        .maybeSingle();

    console.log('Pending Link:', pending);
}

checkPending();
