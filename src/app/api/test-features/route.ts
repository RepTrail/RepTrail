import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email') || 'maatheuscarletoavila@gmail.com'
    
    // Bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 1. Get profile
    const { data: prof, error: profError } = await supabaseAdmin
        .from('profiles')
        .select('id, email, plan_id, role')
        .eq('email', email)
        .single()
        
    // 2. Get the plan details if any
    let planDetails = null
    let planFeatures = null
    
    if (prof?.plan_id) {
        const { data: plan } = await supabaseAdmin.from('plans').select('*').eq('id', prof.plan_id).single()
        planDetails = plan
        
        const { data: features } = await supabaseAdmin.from('plan_features_dynamic').select('*').eq('plan_id', prof.plan_id).single()
        planFeatures = features
    }
        
    return NextResponse.json({ prof, planDetails, planFeatures, profError })
}
