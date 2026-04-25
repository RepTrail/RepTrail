const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
  
  const { error } = await supabase
    .from('student_details')
    .update({ birth_date: '2002-04-24', sex: 'male' })
    .eq('id', studentId);
    
  if (error) {
    console.error('Update Error:', error);
  } else {
    console.log('Update success! Age should now show correctly.');
  }
}

fix();
