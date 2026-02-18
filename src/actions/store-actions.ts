'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getStoreProducts() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('store_products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error fetching store products:', e)
        return []
    }
}

export async function logProductClick(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    try {
        const { error } = await supabase
            .from('product_click_logs')
            .insert({
                student_id: user?.id,
                product_id: productId
            })

        if (error) throw error
        return { success: true }
    } catch (e) {
        console.error('Error logging product click:', e)
        return { success: false }
    }
}

export async function createStoreProduct(data: any) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('store_products')
            .insert(data)

        if (error) throw error
        revalidatePath('/admin/store')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
