
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function forceLink() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const email = 'socramgamer71@gmail.com';
    const relationshipId = 'b9a0967e-f04a-4598-a6d9-7227af9f0038';

    console.log(`--- Forcing link for: ${email} ---`);

    // 1. Find the real student profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', email)
        .maybeSingle();

    if (!profile) {
        console.error('Real profile not found!');
        return;
    }

    console.log('Real Student ID:', profile.id);

    // 2. Update the relationship
    const { error: updateError } = await supabase
        .from('trainer_students')
        .update({
            student_id: profile.id,
            is_placeholder: false
        })
        .eq('id', relationshipId);

    if (updateError) {
        console.error('Update Error:', updateError);
    } else {
        console.log('✅ Link Forced Successfully!');
    }
}

forceLink();
