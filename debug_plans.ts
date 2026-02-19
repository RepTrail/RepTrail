
import { createAdminClient } from './src/lib/supabase/admin'

async function checkPlans() {
    const supabase = createAdminClient()
    if (!supabase) {
        console.error('Supabase admin client could not be initialized.')
        return
    }

    console.log('--- Checking plans table ---')
    const { data: plans, error } = await supabase
        .from('plans')
        .select('*')

    if (error) {
        console.error('Error fetching plans:', error)
    } else {
        console.log(`Found ${plans?.length || 0} plans.`)
        plans?.forEach(p => console.log(`- ${p.name}: ${p.price_monthly} (Students: ${p.max_students})`))
    }

    console.log('--- Checking plan_features table ---')
    const { data: features, error: featError } = await supabase
        .from('plan_features')
        .select('*')

    if (featError) {
        console.error('Error fetching features:', featError)
    } else {
        console.log(`Found ${features?.length || 0} features.`)
        features?.forEach(f => console.log(`- Plan ${f.plan_id}: ${f.feature_key}`))
    }
}

checkPlans()
