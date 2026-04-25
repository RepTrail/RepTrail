
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkRelationship() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const relationshipId = 'b9a0967e-f04a-4598-a6d9-7227af9f0038';
    
    const { data, error } = await supabase
        .from('trainer_students')
        .select('*')
        .eq('id', relationshipId)
        .maybeSingle();

    console.log('Relationship Data:', data);
    if (data) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', data.student_id)
            .maybeSingle();
        console.log('Linked Profile:', profile);
    }
}

checkRelationship();
