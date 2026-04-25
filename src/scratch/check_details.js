
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkDetails() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
    
    const { data: details } = await supabase
        .from('student_details')
        .select('*')
        .eq('id', studentId)
        .maybeSingle();

    console.log('Student Details:', details);
}

checkDetails();
