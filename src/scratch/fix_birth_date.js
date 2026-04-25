const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
  
  // Set birth date to something that results in 22 years (as seen in earlier context?)
  // User context said age wasn't showing, but in previous turns we saw "22" in some placeholders.
  // Let's set it to 2002-04-24
  const { error } = await supabase
    .from('profiles')
    .update({ birth_date: '2002-04-24' })
    .eq('id', studentId);
    
  if (error) {
    console.error('Error updating birth_date:', error);
  } else {
    console.log('Successfully updated birth_date for student!');
  }
}

fix();
