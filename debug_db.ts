
import { createClient } from './src/lib/supabase/server'
import { createAdminClient } from './src/lib/supabase/admin'

async function debug() {
    const supabase = createAdminClient()

    if (!supabase) {
        console.error('Supabase admin client could not be initialized. Check SUPABASE_SERVICE_ROLE_KEY.')
        return
    }

    console.log('--- Checking plan_features table ---')
    const { data: tableInfo, error: tableError } = await supabase
        .from('plan_features')
        .select('*')
        .limit(1)

    if (tableError) {
        console.error('Error fetching plan_features:', tableError)
    } else {
        console.log('plan_features exists. Sample data:', tableInfo)
    }

    console.log('--- Checking admin_logs table ---')
    const { data: logsInfo, error: logsError } = await supabase
        .from('admin_logs')
        .select('*')
        .limit(1)

    if (logsError) {
        console.error('Error fetching admin_logs:', logsError)
    } else {
        console.log('admin_logs exists. Sample data:', logsInfo)
    }

    console.log('--- Checking profiles ---')
    const { data: admins } = await supabase.from('profiles').select('id, full_name, email, is_admin').eq('is_admin', true)
    console.log('Admins:', admins)
}

debug()
