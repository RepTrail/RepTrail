import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function test() {
  const { data, error } = await supabase
    .from('plan_features_dynamic')
    .upsert({ 
        plan_id: 'e499a22f-d11e-451e-8e86-121db5dbcf94', // Fake UUID
        student_limit: null,
        free_students_limit: null,
        price_per_student_cents: null,
        photo_updates_limit: null,
        prestige_points: 0,
        has_workouts: true,
        has_diets: true,
        has_cardio: true,
        has_ergogenics: true,
        has_import_pdf_ai: true,
        has_public_profile: true,
        has_public_feed: false,
        has_store: false,
        has_ranking: true,
        has_elite_badge: false
    }, { onConflict: 'plan_id' })
    .select()

  console.log('Error:', error)
  console.log('Data:', data)
}

test()
