
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetPlaceholder(id) {
    console.log(`Resetting placeholder ${id}...`);
    const { error } = await supabase
        .from('pending_student_links')
        .update({
            diet_ids: [],
            cardio_ids: [],
            workout_ids: [],
            ergogenic_data: []
        })
        .eq('id', id);

    if (error) {
        console.error("Error resetting placeholder:", error);
    } else {
        console.log("Placeholder reset successfully!");
    }
}

resetPlaceholder('59c62d66-1b4e-4641-b1ed-2998f6f27779');
