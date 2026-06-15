import { outboxDB, OutboxRecord, ENTITIES } from './outbox-db';
import { executeAction } from './action-registry';
import { conflictStore } from './conflict-store';
import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './query-keys';
import { logSyncMetric } from './dal/localDb';

class SyncEngine {
  private isProcessing = false;
  private timeoutId: any = null;
  private retryCounts: Record<string, number> = {};
  private currentDelay = 2000;
  private maxDelay = 60000;

  // ─── SINGLE-TAB LEADER (ADR §7) ────────────────────────────────────────────
  private bc: BroadcastChannel | null = null;
  private isLeader = false;

  // QueryClient instance (set by caller after React tree is ready)
  private queryClientInstance: QueryClient | null = null;

  setQueryClient(client: QueryClient) {
    this.queryClientInstance = client;
  }

  // To maintain compatibility with L109+ we can define getter/setter for queryClient
  get queryClient(): QueryClient | null {
    return this.queryClientInstance;
  }

  // ─── BROADCASTCHANNEL INITIALIZATION ─────────────────────────────────────
  private initBroadcastChannel() {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
    try {
      this.bc = new BroadcastChannel('sync-engine');
      this.bc.onmessage = (event) => {
        if (event.data?.type === 'leader-heartbeat') {
          // Another tab declared leadership — we become a follower
          this.isLeader = false;
        }
      };
    } catch {
      // BroadcastChannel not available (old browsers/Safari) — fall back to lock only
    }
  }

  private scheduleNext(delay: number) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.process();
    }, delay);
  }

  async start() {
    if (typeof window === 'undefined') return;
    if (this.timeoutId) return;

    this.initBroadcastChannel();
    console.log('🚀 Sync Engine Started');

    // PHASE 2: TTL CLEANUP ON STARTUP
    try {
        await outboxDB.cleanupProcessedIds();
    } catch (e) {
        console.error('Failed to cleanup processed IDs:', e);
    }

    this.scheduleNext(2000);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  async process() {
    if (this.isProcessing) return;
    
    // ─── CROSS-TAB LOCK + BROADCASTCHANNEL LEADER ELECTION (ADR §7) ──────────
    const lockKey = 'reptrail_sync_lock';
    const lockValue = Date.now().toString();
    const storedLock = localStorage.getItem(lockKey);
    
    // If lock exists and is younger than 10s, another tab is sync'ing
    if (storedLock && (Date.now() - parseInt(storedLock)) < 10000) {
        // Broadcast that we're yielding to another leader
        this.isLeader = false;
        this.scheduleNext(5000); // Check again in 5s
        return;
    }
    
    // Acquire lock and declare leadership via BroadcastChannel
    localStorage.setItem(lockKey, lockValue);
    this.isLeader = true;
    try {
      this.bc?.postMessage({ type: 'leader-heartbeat', tabId: lockValue });
    } catch {
      // ignore if channel closed
    }

    // Check if online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        this.currentDelay = Math.min(this.currentDelay * 2, this.maxDelay);
        this.scheduleNext(this.currentDelay);
        localStorage.removeItem(lockKey);
        return;
    }

    try {
      this.isProcessing = true;

      // ─── COALESCÊNCIA COMPULSÓRIA (ADR §5) ────────────────────────────────
      // Compact redundant pending mutations before dispatching queue.
      const coalesced = await outboxDB.coalesce();

      const pending = await outboxDB.getPending();

      if (pending.length === 0) {
        this.currentDelay = 2000; // Reset backoff when idle
        this.scheduleNext(this.currentDelay);
        return;
      }
      
      console.log(`🔄 [Tab ${lockValue}] Processing ${pending.length} pending mutations (coalesced ${coalesced})...`);
      if (coalesced > 0) {
        logSyncMetric({ event: 'outbox_coalesced', ts: Date.now(), payload: { count: coalesced } });
      }

      let hasError = false;
      for (const record of pending) {
        console.log(`[SyncEngine] 📡 Syncing ${record.action} (${record.id}) - Payload:`, JSON.stringify(record.payload));
        try {
          await this.syncRecord(record);
        } catch (e) {
          hasError = true;
          console.error(`[SyncEngine] Error syncing record ${record.id}:`, e);
          break; // Stop queue processing on first network/sync error
        }
        // Refresh lock during processing of long queues
        localStorage.setItem(lockKey, Date.now().toString());
      }

      if (hasError) {
        this.currentDelay = Math.min(this.currentDelay * 2, this.maxDelay);
        console.log(`[SyncEngine] ⏳ Sync error occurred. Backing off to ${this.currentDelay / 1000}s`);
      } else {
        this.currentDelay = 2000; // Reset backoff on complete success
      }
      this.scheduleNext(this.currentDelay);
    } catch (error) {
      console.error('❌ Sync Engine Error:', error);
      this.currentDelay = Math.min(this.currentDelay * 2, this.maxDelay);
      this.scheduleNext(this.currentDelay);
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
        if (this.queryClient) {
          const userId = (record.payload.userId || record.payload.studentId || record.payload.student_id || record.payload.trainerId || record.payload.trainer_id) as string;
          
          if (result.data) {
            const incoming = result.data;
            const queryKey = this.getQueryKeyForEntity(record.entity, record.payload, record.entityId);
            
            if (queryKey) {
              this.queryClient.setQueryData(queryKey, (old: any) => {
                if (!incoming?.id) return old;

                // CASE A: Array-based Cache (Most entities)
                if (Array.isArray(old)) {
                  const map = new Map(old.map((i: any) => [i.id, i]));
                  
                  // RECONCILIATION: If record.payload.id (local UUID) exists, delete it
                  if (record.payload.id && record.payload.id !== incoming.id) {
                      map.delete(record.payload.id);
                  }

                  map.set(incoming.id, {
                    ...incoming,
                    _optimistic: false,
                    _pending: false
                  });
                  return Array.from(map.values());
                }

                // CASE B: Single-Object Cache (activeSession, status, profile)
                if (old && typeof old === 'object' && !Array.isArray(old)) {
                    // If IDs match OR it's a known single-instance cache
                    return {
                        ...old,
                        ...incoming,
                        _optimistic: false,
                        _pending: false
                    };
                }

                return old;
              });
            }
          }

          // 🚨 ADDITIONAL KEYS INVALIDATION (Precision Consistency)
          if (userId) {
              const rootKeys = [
                QUERY_KEYS.workouts.all(userId),
                QUERY_KEYS.workouts.library(userId),
                QUERY_KEYS.diets.all(userId),
                QUERY_KEYS.diets.library(userId),
                QUERY_KEYS.cardio.all(userId),
                QUERY_KEYS.cardio.library(userId),
                QUERY_KEYS.ergogenics.all(userId),
                QUERY_KEYS.student.all(userId)
              ];

              await Promise.all(rootKeys.map(key => 
                this.queryClient!.invalidateQueries({ 
                    queryKey: key, 
                    exact: false, 
                    refetchType: 'active' 
                })
              ));

              // Explicit refetch for critical active sessions
              this.queryClient.refetchQueries({ queryKey: QUERY_KEYS.workouts.session });
              this.queryClient.refetchQueries({ queryKey: QUERY_KEYS.cardio.session });

              // 🚨 NEW: Invalidate trainer students if a placeholder was created
              if (((result as any).results?.placeholderId || (result as any).data?.placeholderId) && record.payload.userId) {
                  console.log(`[SyncEngine] Placeholder detected (${(result as any).results?.placeholderId || (result as any).data?.placeholderId}). Invalidating trainer students cache for ${record.payload.userId}`);
                  this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.students(record.payload.userId as string) });
              }

              // 🚨 NEW: Handle student status toggle and unassign/delete invalidation
              const studentContentActions = [
                  'unassign-workout',
                  'unassign-diet',
                  'delete-workout',
                  'delete-student-diet',
                  'save-workout-assignment',
                  'save-diet-assignment',
                  'delete-student-cardio',
                  'delete-student-ergogenic',
                  'delete-cardio-assignment',
                  'mark-student-paid',
                  'toggle-student-status'
              ];
              
              if (studentContentActions.includes(record.action)) {
                  // 🚀 LOCAL-FIRST ELITE: Only invalidate if there are no more pending mutations for this relationship/student
                  // This prevents "flickering" when processing multiple unassignments.
                  const relationshipId = (record.payload.relationshipId || record.entityId) as string;
                  const studentId = (record.payload.studentId || record.payload.student_id) as string;
                  
                  const pendingCount = await outboxDB.countPendingForStudent(relationshipId, studentId);
                  
                  if (pendingCount <= 1) { // 1 because we haven't marked this one as processed yet
                      console.log(`[SyncEngine] Last mutation for student ${relationshipId}. Waiting for DB consistency...`);
                      
                      // 🚀 DB CONSISTENCY DELAY: Wait 500ms to ensure Supabase triggers/commits are finished
                      await new Promise(resolve => setTimeout(resolve, 500));

                      if (relationshipId) {
                          await this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId) });
                      }
                      if (studentId) {
                          await Promise.all([
                              this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.studentHistory(studentId) }),
                              this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.assignments(studentId) }),
                              this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diets.assignments(studentId) })
                          ]);
                      }
                      const userId2 = (record.payload.trainerId || record.payload.userId) as string;
                      if (userId2) {
                          await this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.students(userId2) });
                      }
                  } else {
                      console.log(`[SyncEngine] Skipping invalidation: ${pendingCount-1} more mutations pending for student.`);
                  }
              }
          }

          // 🚨 NEW: Handle Admin Dashboard Invalidation
          if (record.entity === ENTITIES.OPERATIONAL_COST || record.action.includes('cost')) {
              console.log('[SyncEngine] Operational Cost updated. Invalidating Admin Overview...');
              await this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview });
          }
        }

        // 3. mark as processed (Persistent)
        await outboxDB.markMutationAsProcessed(record.clientMutationId);
        
        // 4. remove from outbox
        await outboxDB.dequeue(record.id);
        
        // ─ METRIC: sync_success
        logSyncMetric({ event: 'sync_success', ts: Date.now(), payload: { action: record.action, entity: record.entity } });
        
        delete this.retryCounts[record.id];
      } else if (result.conflict) {
        console.warn(`⚠️ Conflict detected for mutation ${record.id}`);
        await outboxDB.markConflict(record.id);
        
        // ─ METRIC: conflict_detected
        logSyncMetric({ event: 'conflict_detected', ts: Date.now(), payload: { action: record.action, entity: record.entity, entityId: record.entityId } });
        
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
        if (
            lowerError.includes('encontrada') || 
            lowerError.includes('not found') || 
            lowerError.includes('id da substância é necessário') ||
            lowerError.includes('substância é necessário') ||
            lowerError.includes('violates foreign key constraint')
        ) {
            console.warn(`⚠️ [SyncEngine] Obsolete/Unrecoverable mutation ${record.id}: ${errorMsg}. Dequeuing.`);
            await outboxDB.markMutationAsProcessed(record.clientMutationId);
            await outboxDB.dequeue(record.id);
            return;
        }

        throw new Error(errorMsg);
      }

    } catch (error: any) {
      console.error(`❌ Failed to sync mutation ${record.id} [Action: ${record.action}]:`, error.message);
      
      const lowerError = String(error.message || '').toLowerCase();
      if (lowerError.includes('violates foreign key constraint')) {
          console.warn(`⚠️ [SyncEngine] Catch: Obsolete/Unrecoverable mutation caught. Dequeuing ${record.id}.`);
          await outboxDB.markMutationAsProcessed(record.clientMutationId);
          await outboxDB.dequeue(record.id);
          delete this.retryCounts[record.id];
          return;
      }

      await outboxDB.updateStatus(record.id, 'pending');
      
      this.retryCounts[record.id] = (this.retryCounts[record.id] || 0) + 1;
      
      // ─ METRIC: sync_failure
      logSyncMetric({ event: 'sync_failure', ts: Date.now(), payload: { action: record.action, entity: record.entity, retries: this.retryCounts[record.id] } });
      
      // ─── CAP RETRIES: move to FAILED (auditable, not silently discarded) ──────
      if (this.retryCounts[record.id] >= 5) {
          console.error(`🔥 Mutation ${record.id} failed after 5 retries. Moving to FAILED queue.`);
          await outboxDB.markFailed(record.id);
          delete this.retryCounts[record.id];

          // Notify the UI — surface a recovery option (toast / recovery banner)
          if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('reptrail:sync-failed', {
                  detail: {
                      id: record.id,
                      action: record.action,
                      entity: record.entity,
                  }
              }));
          }
      }
    }
  }

  private getQueryKeyForEntity(entity: string, payload: any, entityId?: string): any[] | null {
    const userId = (payload.userId || payload.studentId || payload.student_id) as string;

    switch (entity) {
      case ENTITIES.WORKOUT: 
        return entityId ? QUERY_KEYS.workouts.detail(entityId) : (userId ? QUERY_KEYS.workouts.all(userId) : null);
      case ENTITIES.DIET: 
        return entityId ? QUERY_KEYS.diets.detail(entityId) : (userId ? QUERY_KEYS.diets.all(userId) : null);
      case ENTITIES.WORKOUT_LOG: 
        return userId ? QUERY_KEYS.workouts.logs(userId) : null;
      case ENTITIES.PROGRESS_PHOTO: 
        return userId ? QUERY_KEYS.student.photos(userId) : null;
      case ENTITIES.STUDENT_DETAIL: 
        return userId ? QUERY_KEYS.student.details(userId) : null;
      case ENTITIES.TRAINER_STUDENT: 
        return userId ? QUERY_KEYS.trainer.studentDetail(userId) : null;
      case ENTITIES.ASSIGNED_WORKOUT: 
        return userId ? QUERY_KEYS.workouts.all(userId) : null;
      case ENTITIES.WEIGHT_HISTORY: 
        return userId ? QUERY_KEYS.student.metrics(userId) : null;
      case ENTITIES.BF_HISTORY: 
        return userId ? QUERY_KEYS.student.metrics(userId) : null;
      case ENTITIES.CARDIO: 
        return entityId ? QUERY_KEYS.cardio.detail(entityId) : (userId ? QUERY_KEYS.cardio.all(userId) : null);
      case ENTITIES.ERGOGENIC: 
        return userId ? QUERY_KEYS.ergogenics.all(userId) : null;
      case ENTITIES.ERGOGENIC_LOG:
        return userId ? QUERY_KEYS.ergogenics.logs(userId) : null;
      case ENTITIES.USER: 
        return userId ? QUERY_KEYS.profile.detail(userId) : null;
      case ENTITIES.SUBSCRIPTION:
        return ['subscription'];
      case ENTITIES.OPERATIONAL_COST:
        return [...QUERY_KEYS.admin.costs];
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
