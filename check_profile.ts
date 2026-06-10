import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('Fetching profiles...');
  const { data: prof, error } = await supabase
    .from('profiles')
    .select('id, email, plan_id, role')
    .eq('email', 'matheuscarlettosilva@gmail.com')
    .single();
    
  if (error) {
      console.error('Error fetching profile:', error);
      return;
  }
  console.log('Profile:', prof);

  if (prof && !prof.plan_id) {
      console.log('Assigning elite plan to profile...');
      const { data: plan } = await supabase.from('plans').select('id').eq('slug', 'elite').single();
      if (plan) {
          const { error: updateError } = await supabase.from('profiles').update({ plan_id: plan.id }).eq('id', prof.id);
          if (updateError) console.error('Error updating profile:', updateError);
          else console.log('Successfully assigned elite plan!');
      }
  } else if (prof && prof.plan_id) {
      console.log('Profile already has a plan assigned. Fetching plan features...');
      const { data: features, error: featureError } = await supabase
          .from('profiles')
          .select('plan_id, plan_features_dynamic!inner(*)')
          .eq('id', prof.id)
          .single();
      console.log('Features:', features, featureError);
  }
}

run()
