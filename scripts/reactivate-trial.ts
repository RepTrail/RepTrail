import { adminClient } from '../src/lib/supabase/admin';

async function reactivateTrial(email: string) {
    console.log(`🔍 Buscando usuário: ${email}...`);
    
    const { data: profile, error: findError } = await adminClient
        .from('profiles')
        .select('id, full_name, email, auto_training_status')
        .eq('email', email)
        .maybeSingle();

    if (findError) {
        console.error('❌ Erro ao buscar:', findError);
        return;
    }

    if (!profile) {
        console.error('❌ Usuário não encontrado.');
        return;
    }

    console.log(`✅ Usuário encontrado: ${profile.full_name} (${profile.id})`);
    console.log(`📊 Status atual: ${profile.auto_training_status}`);

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    const { error: updateError } = await adminClient
        .from('profiles')
        .update({
            auto_training_status: 'trial',
            auto_training_trial_end: trialEnd.toISOString(),
            auto_training_trial_used: true, // Keep it as used but active
            saw_auto_training_onboarding_modal: false // Reset modal so they see it again
        })
        .eq('id', profile.id);

    if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError);
        return;
    }

    console.log(`🚀 Trial reativado com sucesso até ${trialEnd.toLocaleDateString()}!`);
}

reactivateTrial('socramgamer71@gmail.com');
