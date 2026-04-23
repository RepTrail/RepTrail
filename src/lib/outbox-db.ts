import { openDB, IDBPDatabase } from 'idb';

export type OutboxStatus = 'pending' | 'conflict' | 'processing' | 'processed' | 'failed';

export const ENTITIES = {
  WORKOUT: 'workouts',
  DIET: 'diets',
  CARDIO: 'cardio',
  ERGOGENIC: 'ergogenics',
  PROGRESS_PHOTO: 'progress_photos',
  WORKOUT_LOG: 'workout_logs',
  TRAINER_STUDENT: 'trainer_students',
  ASSIGNED_WORKOUT: 'assigned_workouts',
  STUDENT_DETAIL: 'student_details',
  TRAINER_DETAIL: 'trainer_details',
  WEIGHT_HISTORY: 'weight_history',
  BF_HISTORY: 'bf_history',
  SETTINGS: 'settings',
  CARDIO_LOG: 'cardio_logs',
  AFFILIATE: 'affiliate',
  OPERATIONAL_COST: 'operational_cost',
  PAYOUT: 'payout',
  SUBSCRIPTION: 'subscription',
  ERGOGENIC_LOG: 'ergogenic_log',
  MEAL: 'meal',
  MEAL_ITEM: 'meal_item',
  WORKOUT_EXERCISE: 'workout_exercise',
  USER: 'profiles',
} as const;

export type EntityType = typeof ENTITIES[keyof typeof ENTITIES];

export interface OutboxRecord {
  id: string;               // Outbox Job ID
  clientMutationId: string; // Deterministic ID for idempotency
  clientId: string;         // Local client ID
  action: string;           // Server action name
  payload: any;
  entity: EntityType;
  entityId: string;
  status: OutboxStatus;
  createdAt: number;
}

export interface ProcessedRecord {
  id: string;               // clientMutationId
  createdAt: number;
}

const DB_NAME = 'reptrail-outbox';
const STORE_NAME = 'mutations';
const PROCESSED_STORE = 'processed_ids';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
          });
          store.createIndex('status', 'status');
          store.createIndex('createdAt', 'createdAt');
        }
        
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains(PROCESSED_STORE)) {
            db.createObjectStore(PROCESSED_STORE, {
              keyPath: 'id',
            });
          }
        }
      },
    });
  }
  return dbPromise;
}

export const outboxDB = {
  async enqueue(record: Omit<OutboxRecord, 'status' | 'createdAt'>): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, {
      ...record,
      status: 'pending',
      createdAt: Date.now(),
    });
  },

  async dequeue(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  },

  async getPending(): Promise<OutboxRecord[]> {
    const db = await getDB();
    const records = await db.getAllFromIndex(STORE_NAME, 'status', 'pending');
    return records.sort((a, b) => a.createdAt - b.createdAt);
  },

  async getAll(): Promise<OutboxRecord[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
  },

  async updateStatus(id: string, status: OutboxStatus): Promise<void> {
    const db = await getDB();
    const record = await db.get(STORE_NAME, id);
    if (record) {
      record.status = status;
      await db.put(STORE_NAME, record);
    }
  },

  async markAsProcessed(id: string): Promise<void> {
    await this.updateStatus(id, 'processed');
  },

  async markConflict(id: string): Promise<void> {
    await this.updateStatus(id, 'conflict');
  },

  async markFailed(id: string): Promise<void> {
    await this.updateStatus(id, 'failed');
  },

  async getFailed(): Promise<OutboxRecord[]> {
    const db = await getDB();
    const all = await db.getAll(STORE_NAME);
    return all.filter((r: OutboxRecord) => r.status === 'failed');
  },

  async retryFailed(): Promise<void> {
    const db = await getDB();
    const all = await db.getAll(STORE_NAME);
    const failed = all.filter((r: OutboxRecord) => r.status === 'failed');
    for (const record of failed) {
      record.status = 'pending';
      await db.put(STORE_NAME, record);
    }
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_NAME);
  },

  // ─── Processed IDs Store (Idempotency) ───────────────────────────
  async isProcessed(clientMutationId: string): Promise<boolean> {
    if (!clientMutationId) return false;
    const db = await getDB();
    const record = await db.get(PROCESSED_STORE, clientMutationId);
    return !!record;
  },

  async markMutationAsProcessed(clientMutationId: string): Promise<void> {
    if (!clientMutationId) return;
    const db = await getDB();
    await db.put(PROCESSED_STORE, {
      id: clientMutationId,
      createdAt: Date.now()
    });
  },

  async cleanupProcessedIds(): Promise<void> {
    const db = await getDB();
    const now = Date.now();
    const TTL = 24 * 60 * 60 * 1000; // 24 hours

    const tx = db.transaction(PROCESSED_STORE, 'readwrite');
    const store = tx.objectStore(PROCESSED_STORE);
    let cursor = await store.openCursor();

    while (cursor) {
      if (now - cursor.value.createdAt > TTL) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }
    await tx.done;
  }
};
