import { createClient } from '@/lib/supabase/client'
import { localPut } from './localDb'

const supabase = createClient()

export type SyncableTable = 'profiles' | 'workouts' | 'workout_logs' | 'daily_tracking' | 'assigned_workouts' | 'trainer_students'

export async function syncFromRemote(table: SyncableTable, userId: string): Promise<void> {
  let query = supabase.from(table).select('*')
  
  if (table === 'profiles') {
    query = query.eq('id', userId)
  } else if (table === 'workouts') {
    // Apenas treinos onde o usuário atual é o instrutor/criador
    query = query.eq('trainer_id', userId)
  } else if (table === 'assigned_workouts') {
    query = query.eq('student_id', userId)
  } else if (table === 'daily_tracking') {
    query = query.eq('user_id', userId)
  } else if (table === 'workout_logs') {
    query = query.eq('student_id', userId)
  } else if (table === 'trainer_students') {
    // Alunos vinculados ao treinador ou vice-versa
    query = query.or(`trainer_id.eq.${userId},student_id.eq.${userId}`)
  } else {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error(`[sync] Erro ao buscar ${table}:`, error.message)
    return
  }
  if (!data) return
  for (const row of data) {
    await localPut(table, row)
  }
}

export async function syncMutationToRemote<T extends Record<string, any>>(
  table: SyncableTable,
  operation: 'upsert' | 'delete',
  payload: T
): Promise<{ success: boolean; error?: string }> {
  if (operation === 'upsert') {
    const { error } = await supabase.from(table).upsert(payload)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }
  if (operation === 'delete') {
    const { error } = await supabase.from(table).delete().eq('id', payload.id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }
  return { success: false, error: 'Operação desconhecida' }
}

export async function initialSync(userId: string): Promise<void> {
  const tables: SyncableTable[] = ['profiles', 'workouts', 'assigned_workouts', 'daily_tracking']
  await Promise.allSettled(tables.map(t => syncFromRemote(t, userId)))
}
