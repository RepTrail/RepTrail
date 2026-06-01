import { createClient } from '@/lib/supabase/client'
import { localPut, localGet, getLocalDb } from './localDb'

const supabase = createClient()

// ─── SYNC ENTITY CONTRACT ────────────────────────────────────────────────────
// All syncable domain rows MUST expose these fields for soft-delete & cursor support.
export interface SyncEntity {
  id: string
  updated_at: string
  is_deleted?: boolean
  deleted_at?: string
}

// ─── SYNC CURSOR ─────────────────────────────────────────────────────────────
// Composite cursor stored in sync_metadata (never synced to Supabase).
interface SyncCursor {
  table: string         // keyPath in sync_metadata store
  lastPulledAt: string  // ISO timestamp of last successful pull
  lastPulledId?: string // UUID tie-breaker for same-millisecond rows
}

export type SyncableTable =
  | 'profiles'
  | 'workouts'
  | 'workout_logs'
  | 'daily_tracking'
  | 'assigned_workouts'
  | 'trainer_students'
  | 'diets'
  | 'meals'
  | 'meal_items'
  | 'cardios'
  | 'assigned_cardios'
  | 'assigned_diets'
  | 'ergogenics'
  | 'ergogenic_logs'
  | 'weight_history'
  | 'bf_history'

// ─── CURSOR HELPERS ───────────────────────────────────────────────────────────

async function getCursor(table: SyncableTable): Promise<SyncCursor | null> {
  try {
    const db = await getLocalDb()
    const cursor = await db.get('sync_metadata', table)
    return cursor ?? null
  } catch {
    return null
  }
}

async function saveCursor(table: SyncableTable, lastPulledAt: string, lastPulledId?: string): Promise<void> {
  try {
    const db = await getLocalDb()
    await db.put('sync_metadata', { table, lastPulledAt, lastPulledId })
  } catch (e) {
    console.warn(`[sync] Failed to save cursor for ${table}:`, e)
  }
}

// ─── INCREMENTAL SYNC FROM REMOTE ────────────────────────────────────────────

export async function syncFromRemote(table: SyncableTable, userId: string): Promise<void> {
  // ─── NESTED DESTRUCTURING FOR DIETS ─────────────────────────────────────────
  if (table === 'diets') {
    const cursor = await getCursor('diets')
    let dietQuery = supabase
      .from('diets')
      .select('*, meals(*, meal_items(*))')
      .or(`trainer_id.eq.${userId}`)

    if (cursor) {
      dietQuery = dietQuery.or(
        `updated_at.gt.${cursor.lastPulledAt}` +
        (cursor.lastPulledId
          ? `,and(updated_at.eq.${cursor.lastPulledAt},id.gt.${cursor.lastPulledId})`
          : '')
      )
    }

    const { data, error } = await dietQuery

    if (error) {
      console.error(`[sync] Erro ao buscar diets com aninhados:`, error.message)
      return
    }
    if (!data) return

    let newLastAt = cursor?.lastPulledAt
    let newLastId = cursor?.lastPulledId

    for (const diet of data) {
      const { meals, ...dietData } = diet as any
      // ─── SOFT-DELETE GUARD ────────────────────────────────────────────────
      if ((dietData as SyncEntity).is_deleted) {
        // Keep it locally so UI can filter — but mark it
      }
      await localPut('diets', dietData)

      // Track latest cursor
      if (!newLastAt || (dietData as SyncEntity).updated_at > newLastAt) {
        newLastAt = (dietData as SyncEntity).updated_at
        newLastId = (dietData as SyncEntity).id
      } else if ((dietData as SyncEntity).updated_at === newLastAt &&
                 (dietData as SyncEntity).id > (newLastId ?? '')) {
        newLastId = (dietData as SyncEntity).id
      }

      if (meals) {
        for (const meal of meals) {
          const { meal_items, ...mealData } = meal
          await localPut('meals', mealData)
          if (meal_items) {
            for (const item of meal_items) {
              await localPut('meal_items', item)
            }
          }
        }
      }
    }

    if (newLastAt) await saveCursor('diets', newLastAt, newLastId)
    return
  }

  // ─── INCREMENTAL CURSOR FILTER ────────────────────────────────────────────
  const cursor = await getCursor(table)

  let query = supabase.from(table).select('*')

  // Domain-specific ownership filters
  if (table === 'profiles') {
    query = query.eq('id', userId)
  } else if (table === 'workouts') {
    query = query.eq('trainer_id', userId)
  } else if (table === 'assigned_workouts') {
    query = query.eq('student_id', userId)
  } else if (table === 'daily_tracking') {
    query = query.eq('user_id', userId)
  } else if (table === 'workout_logs') {
    query = query.eq('student_id', userId)
  } else if (table === 'trainer_students') {
    query = query.or(`trainer_id.eq.${userId},student_id.eq.${userId}`)
  } else if (table === 'assigned_diets') {
    query = query.eq('student_id', userId)
  } else if (table === 'cardios') {
    query = query.or(`trainer_id.eq.${userId}`)
  } else if (table === 'assigned_cardios') {
    query = query.eq('student_id', userId)
  } else if (table === 'ergogenics') {
    query = query.or(`trainer_id.eq.${userId},student_id.eq.${userId}`)
  } else if (table === 'ergogenic_logs') {
    query = query.eq('student_id', userId)
  } else if (table === 'weight_history') {
    query = query.eq('student_id', userId)
  } else if (table === 'bf_history') {
    query = query.eq('student_id', userId)
  } else {
    query = query.eq('user_id', userId)
  }

  // Apply incremental cursor (composite: updated_at + id)
  if (cursor) {
    const afterAt = cursor.lastPulledAt
    const afterId = cursor.lastPulledId
    const cursorFilter = afterId
      ? `updated_at.gt.${afterAt},and(updated_at.eq.${afterAt},id.gt.${afterId})`
      : `updated_at.gt.${afterAt}`
    query = query.or(cursorFilter)
  }

  const { data, error } = await query

  if (error) {
    console.error(`[sync] Erro ao buscar ${table}:`, error.message)
    return
  }
  if (!data) return

  let newLastAt = cursor?.lastPulledAt
  let newLastId = cursor?.lastPulledId

  for (const row of data) {
    // ─── SOFT-DELETE GUARD ─────────────────────────────────────────────────
    // Write even soft-deleted rows — UI will filter by is_deleted === true
    await localPut(table, row)

    const entity = row as SyncEntity
    if (!newLastAt || entity.updated_at > newLastAt) {
      newLastAt = entity.updated_at
      newLastId = entity.id
    } else if (entity.updated_at === newLastAt && entity.id > (newLastId ?? '')) {
      newLastId = entity.id
    }
  }

  if (newLastAt) await saveCursor(table, newLastAt, newLastId)
}

// ─── WRITE MUTATIONS TO REMOTE ────────────────────────────────────────────────

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

// ─── INITIAL SYNC (first-boot hydration) ─────────────────────────────────────

export async function initialSync(userId: string): Promise<void> {
  const tables: SyncableTable[] = [
    'profiles',
    'workouts',
    'assigned_workouts',
    'daily_tracking',
    'diets',
    'assigned_diets',
    'cardios',
    'assigned_cardios',
    'ergogenics',
    'ergogenic_logs',
    'weight_history',
    'bf_history'
  ]
  await Promise.allSettled(tables.map(t => syncFromRemote(t, userId)))
}
