
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const userId = '5cc0b039-79db-4e22-a841-3c87a92361a4' // From metadata? No, that's conversation ID. 
// I need the user ID. Marcos Vinicius.

async function check() {
  // Let's find the user first
  const { data: users } = await supabase.from('profiles').select('id, full_name').ilike('full_name', '%Marcos%')
  console.log('Users found:', users)
  
  if (users?.length) {
    const uid = users[0].id
    const { data: ergos } = await supabase.from('ergogenics').select('*').eq('student_id', uid)
    console.log('Ergogenics for user:', ergos)
    
    if (ergos?.length) {
       const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay()
       console.log('Today (Brazil DOW):', today)
       const todayErgos = ergos.filter(e => e.application_days?.includes(today))
       console.log('Ergogenics for today:', todayErgos)
    }
  }
}

check()
