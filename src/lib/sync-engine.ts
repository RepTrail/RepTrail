import { outboxDB, OutboxRecord, ENTITIES } from './outbox-db';
import { executeAction } from './action-registry';
import { conflictStore } from './conflict-store';
import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './query-keys';

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
      
      this.isProcessing = true;
      console.log(`🔄 [Tab ${lockValue}] Processing ${pending.length} pending mutations...`);

      for (const record of pending) {
        console.log(`[SyncEngine] 📡 Syncing ${record.action} (${record.id}) - Payload:`, JSON.stringify(record.payload));
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
          const userId = record.payload.userId || record.payload.studentId || record.payload.student_id;
          
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

          // 🚨 ADDITIONAL KEYS INVALIDATION (Precision Consistency)
          if (userId) {
              const rootKeys = [
                QUERY_KEYS.workouts.all(userId),
                QUERY_KEYS.cardio.all(userId),
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
              if ((result.results?.placeholderId || result.data?.placeholderId) && record.payload.userId) {
                  console.log(`[SyncEngine] Placeholder detected (${result.results?.placeholderId || result.data?.placeholderId}). Invalidating trainer students cache for ${record.payload.userId}`);
                  this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.students(record.payload.userId) });
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
                  const relationshipId = record.payload.relationshipId || record.entityId;
                  const studentId = record.payload.studentId || record.payload.student_id;
                  
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
                      const userId = record.payload.trainerId || record.payload.userId;
                      if (userId) {
                          await this.queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.students(userId) });
                      }
                  } else {
                      console.log(`[SyncEngine] Skipping invalidation: ${pendingCount-1} more mutations pending for student.`);
                  }
              }
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
        if (
            lowerError.includes('encontrada') || 
            lowerError.includes('not found') || 
            lowerError.includes('id da substância é necessário') ||
            lowerError.includes('substância é necessário')
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
      
      await outboxDB.updateStatus(record.id, 'pending');
      
      this.retryCounts[record.id] = (this.retryCounts[record.id] || 0) + 1;
      
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
    const userId = payload.userId || payload.studentId || payload.student_id;

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
