const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId);
    
  console.log('--- PROFILE SEARCH BY ID ---');
  console.log('Data:', data);
  console.log('Error:', error);
}

check();
