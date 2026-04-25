
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function cleanUp() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const email = 'socramgamer71@gmail.com';
    const wrongEmail = 'aluno@reptrail.com.br';
    const relationshipId = 'b9a0967e-f04a-4598-a6d9-7227af9f0038';

    console.log(`--- Final Cleanup ---`);

    // 1. Ensure the relationship points to the correct student
    const { data: realProfile } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', email)
        .maybeSingle();

    if (realProfile) {
        await supabase
            .from('trainer_students')
            .update({ student_id: realProfile.id })
            .eq('id', relationshipId);
        console.log('✅ Relationship updated to real profile:', realProfile.id);
    }

    // 2. Delete any stray pending links for both emails
    await supabase.from('pending_student_links').delete().ilike('student_email', email);
    await supabase.from('pending_student_links').delete().ilike('student_email', wrongEmail);
    console.log('✅ Pending links cleared.');

    // 3. Check for any other placeholder accounts that might be conflicting
    const { data: conficting } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', wrongEmail)
        .maybeSingle();
    
    console.log('Conflicting Profile:', conficting);
}

cleanUp();
