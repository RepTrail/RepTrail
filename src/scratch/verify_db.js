
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verify() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const relationshipId = 'b9a0967e-f04a-4598-a6d9-7227af9f0038';
    
    const { data: relationship } = await supabase
        .from('trainer_students')
        .select(`
            *,
            student:profiles!student_id(*)
        `)
        .eq('id', relationshipId)
        .maybeSingle();

    console.log('--- DATABASE STATE ---');
    console.log('ID:', relationshipId);
    console.log('Student ID in Relationship:', relationship?.student_id);
    console.log('Linked Email:', relationship?.student?.email);
    console.log('Linked Name:', relationship?.student?.full_name);
    
    const { data: pending } = await supabase
        .from('pending_student_links')
        .select('*')
        .eq('id', relationshipId)
        .maybeSingle();
    
    console.log('Still in Pending Table?:', !!pending);
}

verify();
