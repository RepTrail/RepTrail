const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
  
  const { data: existing } = await supabase
    .from('student_details')
    .select('sex')
    .eq('id', studentId)
    .single();
    
  console.log('Current sex value:', existing?.sex);
}

check();
