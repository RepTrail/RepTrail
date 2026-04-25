const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const relationshipId = 'b9a0967e-f04a-4598-a6d9-7227af9f0038';
  
  const { data: rel } = await supabase
    .from('trainer_students')
    .select('*')
    .eq('id', relationshipId)
    .single();
    
  console.log('--- RELATIONSHIP DATA ---');
  console.log(JSON.stringify(rel, null, 2));
}

check();
