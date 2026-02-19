
import { createAdminClient } from './src/lib/supabase/admin'

async function checkStore() {
    const supabase = createAdminClient()
    if (!supabase) {
        console.error('Supabase admin client could not be initialized.')
        return
    }

    console.log('--- Checking store_products table ---')
    const { data: products, error } = await supabase
        .from('store_products')
        .select('*')

    if (error) {
        console.error('Error fetching products:', error)
    } else {
        console.log(`Found ${products?.length || 0} products.`)
        if (products && products.length > 0) {
            console.log('Sample product:', products[0])
        }
    }
}

checkStore()
