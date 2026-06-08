import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function seed() {
    const { data: existing, error: searchError } = await supabase.from('plans').select('id').eq('slug', 'on_demand').single()
    if (existing) {
        console.log('On-Demand plan already exists!')
        return
    }

    const { data: newPlan, error } = await supabase.from('plans').insert({
        name: 'On-Demand',
        slug: 'on_demand',
        description: 'Plano base para alunos sem assinatura fixa.',
        billing_type: 'on_demand',
        base_price_cents: 0,
        sort_order: 1,
        is_active: true,
        stripe_price_id: null,
        stripe_product_id: null
    }).select().single()

    if (error) {
        console.error('Error creating plan:', error)
        return
    }

    const { error: featuresError } = await supabase.from('plan_features_dynamic').insert({
        plan_id: newPlan.id,
        free_students_limit: 5,
        student_limit: null, // unlimited
        price_per_student_cents: 2000, // R$ 20 per student
        photo_updates_limit: null, // unlimited
        photo_updates_price_cents: 0,
        has_custom_app: false,
        has_premium_support: false,
        has_ergogenics: true,
        has_import_pdf_ai: true,
        has_public_profile: true,
        has_public_feed: true,
        has_store: true,
        has_ranking: true,
        has_elite_badge: false
    })

    if (featuresError) {
        console.error('Error creating features:', featuresError)
    } else {
        console.log('Successfully seeded On-Demand plan!')
    }
}

seed()
