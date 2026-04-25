
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function forceClaim() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const email = 'socramgamer71@gmail.com';
    const studentId = '812c9f7a-39e1-43aa-acdd-abe9dbdf189a';
    const trainerId = 'a8df69d6-e024-4e3e-9868-ff5a5bac4b1c';

    console.log(`--- Force Claiming link for: ${email} ---`);

    // 1. Fetch the pending link
    const { data: links } = await supabase
        .from('pending_student_links')
        .select('*')
        .ilike('student_email', email)
        .eq('status', 'pending');

    if (!links || links.length === 0) {
        console.log('No pending links found to claim.');
        return;
    }

    const link = links[0];
    console.log(`Found link: ${link.id}. Claiming...`);

    // 2. Create relationship
    const { error: relErr } = await supabase
        .from('trainer_students')
        .upsert({
            trainer_id: trainerId,
            student_id: studentId,
            billing_source: 'external',
            active: true
        }, { onConflict: 'trainer_id,student_id' });

    if (relErr) console.error('Error creating relationship:', relErr);
    else console.log('Relationship created/updated successfully.');

    // 3. Assign workouts
    if (link.workout_ids && link.workout_ids.length > 0) {
        for (const wId of link.workout_ids) {
            await supabase.from('assigned_workouts').upsert({
                workout_id: wId,
                student_id: studentId,
                active: true
            }, { onConflict: 'workout_id,student_id' });
        }
        console.log(`Assigned ${link.workout_ids.length} workouts.`);
    }

    // 4. Mark as linked
    const { error: updErr } = await supabase
        .from('pending_student_links')
        .update({
            status: 'linked',
            linked_at: new Date().toISOString(),
            linked_student_id: studentId
        })
        .eq('id', link.id);

    if (updErr) console.error('Error updating link status:', updErr);
    else console.log('Link marked as LINKED.');

    console.log('--- Force Claim Complete ---');
}

forceClaim();
