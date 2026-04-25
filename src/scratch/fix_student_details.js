const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
  
  // 1. Check if row exists
  const { data: existing } = await supabase
    .from('student_details')
    .select('*')
    .eq('id', studentId)
    .maybeSingle();
    
  if (existing) {
    console.log('Row exists. Updating...');
    const { error } = await supabase
      .from('student_details')
      .update({ birth_date: '2002-04-24', sex: 'M' })
      .eq('id', studentId);
    if (error) console.error('Update Error:', error);
    else console.log('Update success!');
  } else {
    console.log('Row does not exist. Inserting...');
    const { error } = await supabase
      .from('student_details')
      .insert({ id: studentId, birth_date: '2002-04-24', sex: 'M' });
    if (error) console.error('Insert Error:', error);
    else console.log('Insert success!');
  }
}

fix();
