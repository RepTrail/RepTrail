import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface RepTrailDB extends DBSchema {
  profiles:              { key: string; value: any }
  student_details:       { key: string; value: any }
  workouts:              { key: string; value: any }
  workout_exercises:     { key: string; value: any }
  exercises:             { key: string; value: any }
  workout_logs:          { key: string; value: any }
  daily_tracking:        { key: string; value: any; indexes: { 'by-user-date': [string, string] } }
  assigned_workouts:     { key: string; value: any }
  trainer_students:      { key: string; value: any }
  bf_history:            { key: string; value: any }
  weight_history:        { key: string; value: any }
  progress_photos:       { key: string; value: any }
  affiliate_commissions: { key: string; value: any }
  affiliate_payouts:     { key: string; value: any }
  affiliate_clicks:      { key: string; value: any }
  trainer_reviews:       { key: string; value: any }
  app_settings:          { key: string; value: any }
  push_subscriptions:    { key: string; value: any }
  plan_features:         { key: string; value: any }
  store_products:        { key: string; value: any }
  product_clicks:        { key: string; value: any }
  admin_logs:            { key: string; value: any }
  diets:                 { key: string; value: any }
  meals:                 { key: string; value: any }
  meal_items:            { key: string; value: any }
  cardios:               { key: string; value: any }
  assigned_cardios:      { key: string; value: any }
  assigned_diets:        { key: string; value: any }
  ergogenics:            { key: string; value: any }
  ergogenic_logs:        { key: string; value: any }
  sync_metadata:         { key: string; value: any }
  sync_metrics:          { key: string; value: any }
}

let db: IDBPDatabase<RepTrailDB> | null = null

export async function getLocalDb(): Promise<IDBPDatabase<RepTrailDB>> {
  if (db) return db
  db = await openDB<RepTrailDB>('reptrail-local', 3, {
    upgrade(database, oldVersion) {
      const stores: (keyof RepTrailDB)[] = [
        'profiles', 'student_details', 'workouts', 'workout_exercises',
        'exercises', 'workout_logs', 'assigned_workouts', 'trainer_students',
        'bf_history', 'weight_history', 'progress_photos', 'affiliate_commissions',
        'affiliate_payouts', 'affiliate_clicks', 'trainer_reviews', 'app_settings',
        'push_subscriptions', 'plan_features', 'store_products', 'product_clicks',
        'admin_logs',
        'diets', 'meals', 'meal_items', 'cardios', 'assigned_cardios', 'assigned_diets',
        'ergogenics', 'ergogenic_logs'
      ]
      for (const store of stores) {
        if (!database.objectStoreNames.contains(store as any)) {
          database.createObjectStore(store as any, { keyPath: 'id' })
        }
      }
      // ─── V3 MIGRATION: sync_metadata keyPath changed entityId → table ───────
      // Must delete the old store before recreating — keyPath changes are not allowed in-place.
      if (oldVersion < 3 && database.objectStoreNames.contains('sync_metadata')) {
        database.deleteObjectStore('sync_metadata')
      }
      if (!database.objectStoreNames.contains('sync_metadata')) {
        database.createObjectStore('sync_metadata', { keyPath: 'table' })
      }

      // ─── V3: Operational Metrics store (ADR §10) ─────────────────────────────
      if (!database.objectStoreNames.contains('sync_metrics')) {
        const metricsStore = database.createObjectStore('sync_metrics' as any, { keyPath: 'id', autoIncrement: true })
        ;(metricsStore as any).createIndex('by-event', 'event')
        ;(metricsStore as any).createIndex('by-ts', 'ts')
      }
      if (!database.objectStoreNames.contains('daily_tracking')) {
        const dtStore = database.createObjectStore('daily_tracking', { keyPath: 'id' })
        dtStore.createIndex('by-user-date', ['user_id', 'date'])
      }
    }
  })
  return db
}

export async function localGet<T>(store: keyof RepTrailDB, id: string): Promise<T | null> {
  const database = await getLocalDb()
  const result = await database.get(store as any, id)
  return (result ?? null) as T | null
}

export async function localGetAll<T>(store: keyof RepTrailDB): Promise<T[]> {
  const database = await getLocalDb()
  return database.getAll(store as any) as Promise<T[]>
}

export async function localPut<T extends { id: string }>(store: keyof RepTrailDB, value: T): Promise<void> {
  const database = await getLocalDb()
  await database.put(store as any, value)
}

export async function localDelete(store: keyof RepTrailDB, id: string): Promise<void> {
  const database = await getLocalDb()
  await database.delete(store as any, id)
}

export async function localClear(store: keyof RepTrailDB): Promise<void> {
  const database = await getLocalDb()
  await database.clear(store as any)
}

// ─── OPERATIONAL METRICS (ADR §10) ───────────────────────────────────────────
export type SyncMetricEvent =
  | 'sync_success'
  | 'sync_failure'
  | 'outbox_dispatched'
  | 'outbox_coalesced'
  | 'conflict_detected'
  | 'retry'

export interface SyncMetric {
  event: SyncMetricEvent
  ts: number            // Unix ms
  table?: string
  payload?: Record<string, unknown>
}

const METRICS_MAX_ROWS = 1000
const METRICS_TTL_MS   = 30 * 24 * 60 * 60 * 1000 // 30 days

export async function logSyncMetric(metric: SyncMetric): Promise<void> {
  try {
    const database = await getLocalDb()
    await database.add('sync_metrics' as any, metric)

    // Rolling window: prune old entries (TTL + cap)
    const tx = database.transaction('sync_metrics' as any, 'readwrite')
    const store = tx.objectStore('sync_metrics' as any)
    const now = Date.now()
    let cursor = await store.openCursor()
    let count = await store.count()
    while (cursor) {
      if (now - cursor.value.ts > METRICS_TTL_MS || count > METRICS_MAX_ROWS) {
        await cursor.delete()
        count--
      }
      cursor = await cursor.continue()
    }
    await tx.done
  } catch {
    // Metrics are best-effort — never crash the app
  }
}
