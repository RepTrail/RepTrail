'use server'

import { createClient } from '@/lib/supabase/server'
import { PlanFeatures } from '@/types'

type FeatureKey = keyof Omit<PlanFeatures, 'plan_id'>

// Retorna o valor de uma feature booleana ou numérica para um trainer
export async function trainerHasFeature(
  trainerId: string,
  feature: FeatureKey
): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('plan_id, plan_features_dynamic!inner(*)')
    .eq('id', trainerId)
    .single()

  if (!data?.plan_features_dynamic) return false
  
  const features = Array.isArray(data.plan_features_dynamic) ? data.plan_features_dynamic[0] : data.plan_features_dynamic
  if (!features) return false

  const value = features[feature]
  return Boolean(value)
}

// Retorna o valor numérico de um limite (null = ilimitado)
export async function trainerFeatureLimit(
  trainerId: string,
  feature: 'student_limit' | 'free_students_limit' | 'price_per_student_cents' | 'photo_updates_limit'
): Promise<number | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('plan_id, plan_features_dynamic!inner(*)')
    .eq('id', trainerId)
    .single()

  if (!data?.plan_features_dynamic) return 0
  
  const features = Array.isArray(data.plan_features_dynamic) ? data.plan_features_dynamic[0] : data.plan_features_dynamic
  if (!features) return 0

  return features[feature] ?? null
}

// Retorna todas as features de um trainer de uma vez (evita N queries)
export async function getTrainerPlanFeatures(
  trainerId: string
): Promise<PlanFeatures | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('plan_id, plan_features_dynamic!inner(*)')
    .eq('id', trainerId)
    .single()

  if (!data?.plan_features_dynamic) return null

  const features = Array.isArray(data.plan_features_dynamic) ? data.plan_features_dynamic[0] : data.plan_features_dynamic
  return features as PlanFeatures
}
