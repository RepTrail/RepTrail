
import { adminClient } from '../src/lib/supabase/admin';

async function run() {
    console.log('Checking assignments for TREINO C...');
    const { data, error } = await adminClient
        .from('workouts')
        .select(`
            name, 
            assignments:assigned_workouts(*)
        `)
        .eq('name', 'TREINO C');
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Results:');
    console.log(JSON.stringify(data, null, 2));
}

run();
