'use server'

import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { revalidatePath, revalidateTag } from 'next/cache'
import { PlanWithStats, PlanWithFeatures } from '@/types'

export async function getPlansWithStats(): Promise<PlanWithStats[]> {
    const supabase = adminClient

    // Buscamos os planos
    const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('*, plan_features_dynamic(*)')
        .order('sort_order', { ascending: true })

    if (plansError) throw new Error(plansError.message)

    // Buscamos o total de profiles agrupados por plan_id
    const { data: stats, error: statsError } = await supabase
        .from('profiles')
        .select('plan_id')
        .not('plan_id', 'is', null)

    if (statsError) throw new Error(statsError.message)

    // Agrupando
    const subscribersCount: Record<string, number> = {}
    stats.forEach(s => {
        if (s.plan_id) {
            subscribersCount[s.plan_id] = (subscribersCount[s.plan_id] || 0) + 1
        }
    })

    return plans.map(p => ({
        ...p,
        plan_features_dynamic: Array.isArray(p.plan_features_dynamic) ? p.plan_features_dynamic[0] : p.plan_features_dynamic,
        subscriber_count: subscribersCount[p.id] || 0
    }))
}

export async function getPlanById(id: string): Promise<PlanWithFeatures> {
    const supabase = adminClient

    const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*, plan_features_dynamic(*)')
        .eq('id', id)
        .single()

    if (planError) throw new Error(planError.message)
    return {
        ...plan,
        plan_features_dynamic: Array.isArray(plan.plan_features_dynamic) ? plan.plan_features_dynamic[0] : plan.plan_features_dynamic
    }
}

export async function togglePlanActive(id: string): Promise<{ success: boolean }> {
    const supabase = adminClient

    const { data: plan } = await supabase.from('plans').select('is_active').eq('id', id).single()
    if (!plan) throw new Error('Plano não encontrado')

    const { error } = await supabase
        .from('plans')
        .update({ is_active: !plan.is_active })
        .eq('id', id)

    if (error) throw new Error(error.message)
    
    revalidatePath('/admin/plans')
    return { success: true }
}

type PlanFormData = any

export async function createPlan(data: PlanFormData): Promise<{ success: boolean; error?: string }> {
    const supabase = adminClient

    const { features, ...planData } = data

    const { data: newPlan, error: planError } = await supabase
        .from('plans')
        .insert(planData)
        .select()
        .single()

    if (planError) return { success: false, error: planError.message }

    const { error: featuresError } = await supabase
        .from('plan_features_dynamic')
        .insert({
            ...features,
            plan_id: newPlan.id
        })

    if (featuresError) {
        await supabase.from('plans').delete().eq('id', newPlan.id)
        return { success: false, error: featuresError.message }
    }

    revalidatePath('/admin/plans')
    return { success: true }
}

export async function updatePlan(id: string, data: PlanFormData): Promise<{ success: boolean; error?: string }> {
    const supabase = adminClient

    const { features, ...planData } = data

    const { error: planError } = await supabase
        .from('plans')
        .update(planData)
        .eq('id', id)

    if (planError) return { success: false, error: planError.message }

    const { error: featuresError } = await supabase
        .from('plan_features_dynamic')
        .update(features)
        .eq('plan_id', id)

    if (featuresError) return { success: false, error: featuresError.message }

    revalidatePath('/admin/plans')
    return { success: true }
}

export async function deletePlan(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = adminClient

    // Delete features first to avoid foreign key violation
    await supabase.from('plan_features_dynamic').delete().eq('plan_id', id)

    // Delete plan
    const { error } = await supabase.from('plans').delete().eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin/plans')
    return { success: true }
}
