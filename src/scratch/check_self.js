const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const trainerId = 'a8df69d6-e024-4e3e-9868-ff5a5bac4b1c';
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', trainerId)
    .single();
    
  console.log('--- TRAINER PROFILE ---');
  console.log('Name:', profile?.full_name);
  console.log('Email:', profile?.email);
}

check();
