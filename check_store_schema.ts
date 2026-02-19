
import { createAdminClient } from './src/lib/supabase/admin'

async function checkStoreSchema() {
    const supabase = createAdminClient()
    if (!supabase) {
        console.error('Supabase admin client could not be initialized.')
        return
    }

    const { data: products, error } = await supabase
        .from('store_products')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error fetching store_products:', error)
    } else {
        console.log('Columns in store_products:', Object.keys(products?.[0] || {}))
    }
}

checkStoreSchema()
