import { outboxDB } from './outbox-db';
import { conflictDetector } from './conflict-detector';
import { conflictStore } from './conflict-store';
import { getQueryClient } from '@/lib/get-query-client';

/**
 * Logic to resolve conflicts detected by the Sync Engine.
 */
export const conflictResolver = {
  /**
   * Strategically resolves a conflict.
   * By default, it uses "Local Wins" with automatic field merging where possible.
   */
  async resolve(mutationId: string, strategy: 'KEEP_LOCAL' | 'ACCEPT_REMOTE' | 'MERGE' = 'KEEP_LOCAL') {
    const conflicts = conflictStore.getConflicts();
    const conflict = conflicts.find(c => c.id === mutationId);

    if (!conflict) return;

    const queryClient = getQueryClient();

    switch (strategy) {
      case 'KEEP_LOCAL':
        // 1. Keep the local intent. We leave it in the Outbox and retry.
        // We might need to force the update on server by ignoring OCC in the next try
        // For now, we just mark it as pending again to re-trigger sync
        await outboxDB.updateStatus(mutationId, 'pending');
        break;

      case 'ACCEPT_REMOTE':
        // 1. Accept the server version.
        // 2. Remove from Outbox
        await outboxDB.dequeue(mutationId);
        // 3. Update local cache with remote data
        // We'll need the queryKey which might be tricky to get here without a registry
        // But we can rely on Realtime sync to eventually fix the UI or invalidate.
        break;

      case 'MERGE':
        // 1. Try to merge fields
        const mergedData = conflictDetector.merge(conflict.localData, conflict.remoteData);
        // 2. Update Outbox with merged data
        const db = await outboxDB.getAll();
        const record = db.find(r => r.id === mutationId);
        if (record) {
            record.payload = mergedData;
            await outboxDB.dequeue(mutationId);
            await outboxDB.enqueue(record);
        }
        break;
    }

    // Always remove from conflict store once "resolved"
    conflictStore.resolveConflict(mutationId);
  }
};
