import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function check() {
    const email = 'aluno1@gmail.com' // or something
    // Let's just fetch recent 5 profiles
    const { data: p } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
    console.log(p)
}
check()
