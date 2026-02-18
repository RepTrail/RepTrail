
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubjlkztymdaggikvzsu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Ympsa3p0eW1kYWdnaWt2enN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODU5MDMsImV4cCI6MjA4Njg2MTkwM30.CWgeiRIGrpCYdGcxK6npcv3PP3RkRC3Cz4Bpwr7DRFA'
const supabase = createClient(supabaseUrl, supabaseKey)

import * as fs from 'fs'

async function check() {
    let output = '--- CHECKING CARDIO TABLES ---\n'

    const tables = [
        'cardios',
        'assigned_cardios',
        'cardio_logs',
        'cardio_sessions',
        'progress_photos',
        'bf_history',
        'weight_history',
        'store_products',
        'affiliate_links',
        'product_click_logs',
        'admin_logs',
        'plan_features',
        'search_logs'
    ]

    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1)

        if (error) {
            output += `Table ${table}: ERROR - ${error.message} (${error.code})\n`
        } else {
            output += `Table ${table}: EXISTS\n`
        }
    }

    fs.writeFileSync('diag_results.txt', output)
    console.log('Results written to diag_results.txt')
}

check()
