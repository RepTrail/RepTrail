import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    const { data: prof } = await supabase.from('profiles').select('plan_id').eq('id', '450e9218-e98d-482b-b3b8-ff7a93fa6309').single();
    if (prof) {
        console.log('Trainer plan_id:', prof.plan_id);
        const { data, error } = await supabase.from('plan_features_dynamic').update({ has_ergogenics: false }).eq('plan_id', prof.plan_id);
        console.log('Update result:', data, error);
        
        const { data: verify } = await supabase.from('plan_features_dynamic').select('has_ergogenics').eq('plan_id', prof.plan_id).single();
        console.log('Verified has_ergogenics:', verify.has_ergogenics);
    }
}
main();
