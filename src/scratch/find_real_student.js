const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function find() {
  // Search for any student with "Marcos" in the name or similar email
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, birth_date')
    .ilike('full_name', '%Marcos%')
    .limit(10);
    
  console.log('--- POTENTIAL STUDENT PROFILES ---');
  profiles?.forEach(p => {
    console.log(`- ${p.full_name} | ID: ${p.id} | Email: ${p.email} | Role: ${p.role} | BDay: ${p.birth_date}`);
  });
}

find();
