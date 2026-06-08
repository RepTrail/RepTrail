import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function test() {
    const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('*, plan_features_dynamic(*)')
        .order('sort_order', { ascending: true })

    console.log('Plans:', plans)
    if (plansError) console.error(plansError)
}

test()
