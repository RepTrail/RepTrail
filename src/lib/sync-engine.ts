import { outboxDB, OutboxRecord, ENTITIES } from './outbox-db';
import { executeAction } from './action-registry';
import { conflictStore } from './conflict-store';
import { QueryClient } from '@tanstack/react-query';

class SyncEngine {
  private isProcessing = false;
  private interval: any = null;
  private queryClient: QueryClient | null = null;
  private retryCounts: Record<string, number> = {};

  setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  async start() {
    if (typeof window === 'undefined') return;
    if (this.interval) return;

    console.log('🚀 Sync Engine Started');

    // PHASE 2: TTL CLEANUP ON STARTUP
    try {
        await outboxDB.cleanupProcessedIds();
    } catch (e) {
        console.error('Failed to cleanup processed IDs:', e);
    }

    this.interval = setInterval(() => {
      this.process();
    }, 5000); // Check every 5 seconds

    this.process();
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async process() {
    if (this.isProcessing) return;
    
    // ─── CROSS-TAB LOCK ──────────────────────────────────────────────
    const lockKey = 'reptrail_sync_lock';
    const lockValue = Date.now().toString();
    const storedLock = localStorage.getItem(lockKey);
    
    // If lock exists and is younger than 10s, another tab is sync'ing
    if (storedLock && (Date.now() - parseInt(storedLock)) < 10000) {
        return;
    }
    
    // Acquire lock
    localStorage.setItem(lockKey, lockValue);

    // Check if online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
    }

    try {
      this.isProcessing = true;
      const pending = await outboxDB.getPending();

      if (pending.length === 0) return;

      console.log(`🔄 [Tab ${lockValue}] Processing ${pending.length} pending mutations...`);

      for (const record of pending) {
        await this.syncRecord(record);
        // Refresh lock during processing of long queues
        localStorage.setItem(lockKey, Date.now().toString());
      }
    } catch (error) {
      console.error('❌ Sync Engine Error:', error);
    } finally {
      this.isProcessing = false;
      localStorage.removeItem(lockKey);
    }
  }

  private async syncRecord(record: OutboxRecord) {
    try {
      // 🚨 HARD IDEMPOTENCY GUARD (Persistent)
      const alreadyProcessed = await outboxDB.isProcessed(record.clientMutationId);
      if (alreadyProcessed) {
          console.log(`[SyncEngine] 🛡️ Guard: Job ${record.id} already processed. Skipping.`);
          await outboxDB.dequeue(record.id);
          return;
      }

      await outboxDB.updateStatus(record.id, 'processing');

      // ─── PHASES 4, 8 & 10: STRICT EXECUTION PIPELINE ─────────────────────
      
      // 1. executeAction()
      const result = await executeAction(record.action, record.payload) as any;

      if (result.success) {
        console.log(`✅ Mutation ${record.id} synced successfully.`);
        
        // 2. apply cache patch (queryClient.setQueryData)
        if (this.queryClient && result.data) {
          const incoming = result.data;
          const queryKey = this.getQueryKeyForEntity(record.entity, record.payload, record.entityId);
          
          if (queryKey) {
            this.queryClient.setQueryData(queryKey, (old: any = []) => {
              if (!incoming?.id) return old;
              
              // Map-based Deterministic Merge (ULTRA-SAFE)
              const map = new Map(Array.isArray(old) ? old.map((i: any) => [i.id, i]) : []);
              const prev = map.get(incoming.id);

              // ─── PHASE 10: ITEM-LEVEL FLAG PROTECTION ───────────────────
              // We mark it as false here because we ARE the sync engine finishing the job
              map.set(incoming.id, {
                ...prev,
                ...incoming,
                _optimistic: false,
                _pending: false,
                _error: undefined
              });

              return Array.from(map.values());
            });
          }
        }

        // 3. mark as processed (Persistent)
        await outboxDB.markMutationAsProcessed(record.clientMutationId);
        
        // 4. remove from outbox
        await outboxDB.dequeue(record.id);
        
        delete this.retryCounts[record.id];
      } else if (result.conflict) {
        console.warn(`⚠️ Conflict detected for mutation ${record.id}`);
        await outboxDB.markConflict(record.id);
        
        conflictStore.addConflict({
            id: record.id,
            entity: record.entity,
            entityId: record.entityId,
            localData: record.payload,
            remoteData: result.remote,
            action: record.action,
            timestamp: Date.now()
        });
      } else {
        const errorMsg = String(result.error || 'Unknown server error');
        const lowerError = errorMsg.toLowerCase();
        
        console.log(`[SyncEngine] Action ${record.action} failed: "${errorMsg}"`);

        // ─── OBSOLETE STATE PROTECTION ─────────────────────────────────────
        // If the server says "Not Found", the entity might have been deleted 
        // by another mutation or previous attempt. We consider it obsolete.
        if (lowerError.includes('encontrada') || lowerError.includes('not found')) {
            console.warn(`⚠️ [SyncEngine] Obsolete mutation ${record.id}: ${errorMsg}. Dequeuing.`);
            await outboxDB.markMutationAsProcessed(record.clientMutationId);
            await outboxDB.dequeue(record.id);
            return;
        }

        throw new Error(errorMsg);
      }

    } catch (error: any) {
      console.error(`❌ Failed to sync mutation ${record.id}:`, error.message);
      
      await outboxDB.updateStatus(record.id, 'pending');
      
      this.retryCounts[record.id] = (this.retryCounts[record.id] || 0) + 1;
      
      // PHASE 3: CAP RETRIES AT 5
      if (this.retryCounts[record.id] >= 5) {
          console.error(`🔥 Mutation ${record.id} failed after 5 retries. Marking as FAILED.`);
          await outboxDB.updateStatus(record.id, 'processed'); // Move to processed store or similar if we had a failed store
          // We can use 'processed' or a new 'failed' status if we add it. 
          // For now, let's mark it so it stops looping.
      }
    }
  }

  private getQueryKeyForEntity(entity: string, payload: any, entityId?: string): any[] | null {
    const userId = payload.userId || payload.studentId || payload.student_id;

    switch (entity) {
      case ENTITIES.WORKOUT: 
        return entityId ? ['workouts', entityId] : (userId ? ['workouts', userId] : ['workouts']);
      case ENTITIES.DIET: 
        return entityId ? ['diets', entityId] : (userId ? ['diets', userId] : ['diets']);
      case ENTITIES.WORKOUT_LOG: 
        return userId ? ['workouts', userId, 'logs'] : ['workouts', 'logs'];
      case ENTITIES.PROGRESS_PHOTO: 
        return userId ? ['student', userId, 'photos'] : ['student', 'photos'];
      case ENTITIES.STUDENT_DETAIL: 
        return userId ? ['student', userId, 'details'] : ['student', 'details'];
      case ENTITIES.TRAINER_STUDENT: 
        return userId ? ['trainer', 'student', userId] : ['trainer'];
      case ENTITIES.ASSIGNED_WORKOUT: 
        return userId ? ['workouts', userId] : ['workouts'];
      case ENTITIES.WEIGHT_HISTORY: 
        return userId ? ['student', userId, 'metrics'] : ['student', 'metrics'];
      case ENTITIES.BF_HISTORY: 
        return userId ? ['student', userId, 'metrics'] : ['student', 'metrics'];
      case ENTITIES.CARDIO: 
        return entityId ? ['cardio', entityId] : (userId ? ['cardio', userId] : ['cardio']);
      case ENTITIES.ERGOGENIC: 
        return userId ? ['ergogenics', userId] : ['ergogenics'];
      case ENTITIES.ERGOGENIC_LOG:
        return userId ? ['ergogenics', userId, 'logs'] : ['ergogenics', 'logs'];
      case ENTITIES.USER: 
        return userId ? ['profile', userId] : ['profile'];
      case ENTITIES.SUBSCRIPTION:
        return ['subscription'];
      case ENTITIES.OPERATIONAL_COST:
        return ['admin', 'operational-costs'];
      default: 
        return [entity as any];
    }
  }

  trigger() {
      this.process();
  }
}

export const syncEngine = new SyncEngine();

if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        console.log('📡 System back online. Triggering sync...');
        syncEngine.trigger();
    });
}
