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
}

let db: IDBPDatabase<RepTrailDB> | null = null

export async function getLocalDb(): Promise<IDBPDatabase<RepTrailDB>> {
  if (db) return db
  db = await openDB<RepTrailDB>('reptrail-local', 1, {
    upgrade(database) {
      const stores: (keyof RepTrailDB)[] = [
        'profiles', 'student_details', 'workouts', 'workout_exercises',
        'exercises', 'workout_logs', 'assigned_workouts', 'trainer_students',
        'bf_history', 'weight_history', 'progress_photos', 'affiliate_commissions',
        'affiliate_payouts', 'affiliate_clicks', 'trainer_reviews', 'app_settings',
        'push_subscriptions', 'plan_features', 'store_products', 'product_clicks',
        'admin_logs'
      ]
      for (const store of stores) {
        if (!database.objectStoreNames.contains(store as any)) {
          database.createObjectStore(store as any, { keyPath: 'id' })
        }
      }
      if (!database.objectStoreNames.contains('daily_tracking')) {
        const dtStore = database.createObjectStore('daily_tracking', { keyPath: 'id' })
        dtStore.createIndex('by-user-date', ['user_id', 'date'])
      }
    }
  })
  return db
}

export async function localGet<T>(store: keyof RepTrailDB, id: string): Promise<T | undefined> {
  const database = await getLocalDb()
  return database.get(store as any, id) as Promise<T | undefined>
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
