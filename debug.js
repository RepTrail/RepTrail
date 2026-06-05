const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const email = 'personal@reptrail.com.br'; // The user email from the screenshot is personal@reptrail.com.br
    console.log("Checking for email:", email);
    
    // 1. check profiles
    const { data: profiles } = await supabase.from('profiles').select('id, email, is_placeholder, role, full_name').ilike('email', `%${email}%`);
    console.log("Profiles:", profiles);
    
    // 2. check pending_student_links
    const { data: pending } = await supabase.from('pending_student_links').select('*').ilike('student_email', `%${email}%`);
    console.log("Pending Links:", pending);

    // 3. check trainer_students
    if (profiles && profiles.length > 0) {
        for (const p of profiles) {
            const { data: links } = await supabase.from('trainer_students').select('*').eq('student_id', p.id);
            console.log(`Trainer Links for ${p.id} (is_placeholder=${p.is_placeholder}):`, links);
        }
    }
}
check();
