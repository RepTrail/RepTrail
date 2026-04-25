const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function purge() {
  const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
  
  console.log(`Starting forced purge for student ${studentId}...`);

  const results = await Promise.all([
    supabase.from('assigned_workouts').delete().eq('student_id', studentId),
    supabase.from('assigned_diets').delete().eq('student_id', studentId),
    supabase.from('assigned_cardios').delete().eq('student_id', studentId),
    supabase.from('ergogenics').delete().eq('student_id', studentId)
  ]);

  results.forEach((r, i) => {
    const tables = ['workouts', 'diets', 'cardios', 'ergogenics'];
    if (r.error) console.error(`Error purging ${tables[i]}:`, r.error);
    else console.log(`Purged ${tables[i]} successfully.`);
  });

  console.log('Purge complete! Refresh your dashboard.');
}

purge();
