import { adminClient } from '../src/lib/supabase/admin';

async function verify() {
    const userId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
    
    console.log('--- RELACIONAMENTO COM TREINADOR ---');
    const { data: trainerRel } = await adminClient
        .from('trainer_students')
        .select('*')
        .eq('student_id', userId)
        .eq('active', true)
        .maybeSingle();
    console.log(JSON.stringify(trainerRel, null, 2));

    console.log('\n--- CARDIOS ATIVOS NO BANCO ---');
    const { data: cardios } = await adminClient
        .from('assigned_cardios')
        .select('*, cardio:cardios(*)')
        .eq('student_id', userId)
        .eq('active', true);
    console.log(JSON.stringify(cardios, null, 2));
}

verify();
