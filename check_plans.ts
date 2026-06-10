import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('Fetching profiles...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, plan_id, plan_features_dynamic!inner(*)')
    .limit(5);
    
  if (error) console.error('Error fetching profiles with inner join:', error);
  else console.log('Profiles with inner join:', data);
}

run()
