const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const relationshipId = 'b9a0967e-f04a-4598-a6d9-7227af9f0038';
  
  // 1. Get Relationship Info
  const { data: rel } = await supabase
    .from('trainer_students')
    .select('*')
    .eq('id', relationshipId)
    .single();
    
  if (!rel) {
    console.log('Relationship not found');
    return;
  }
  
  console.log('--- RELATIONSHIP ---');
  console.log('Trainer:', rel.trainer_id);
  console.log('Student:', rel.student_id);
  
  const studentId = rel.student_id;
  
  // 2. Check Workouts
  const { data: workouts } = await supabase
    .from('assigned_workouts')
    .select('*, workouts(name, trainer_id)')
    .eq('student_id', studentId)
    .eq('active', true);
    
  console.log('\n--- ACTIVE WORKOUTS ---');
  workouts?.forEach(w => {
    console.log(`- ${w.workouts.name} | Assignment ID: ${w.id} | Assigned By: ${w.trainer_id} | Workout Owner: ${w.workouts.trainer_id}`);
  });
  
  // 3. Check Diets
  const { data: diets } = await supabase
    .from('assigned_diets')
    .select('*, diets(name, trainer_id)')
    .eq('student_id', studentId)
    .eq('active', true);
    
  console.log('\n--- ACTIVE DIETS ---');
  diets?.forEach(d => {
    console.log(`- ${d.diets.name} | Assignment ID: ${d.id} | Assigned By: ${d.trainer_id} | Diet Owner: ${d.diets.trainer_id}`);
  });
  
  // 4. Check Cardios
  const { data: cardios } = await supabase
    .from('assigned_cardios')
    .select('*, cardios(name, trainer_id)')
    .eq('student_id', studentId)
    .eq('active', true);
    
  console.log('\n--- ACTIVE CARDIOS ---');
  cardios?.forEach(c => {
    console.log(`- ${c.cardios.name} | Assignment ID: ${c.id} | Assigned By: ${c.trainer_id} | Cardio Owner: ${c.cardios.trainer_id}`);
  });
  
  // 5. Check Ergogenics
  const { data: ergos } = await supabase
    .from('ergogenics')
    .select('*')
    .eq('student_id', studentId);
    
  console.log('\n--- ERGOGENICS ---');
  ergos?.forEach(e => {
    console.log(`- ${e.name} | ID: ${e.id} | Owner: ${e.trainer_id}`);
  });
}

check();
