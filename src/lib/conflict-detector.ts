/**
 * Simple conflict detection and merging logic for Local-First synchronization.
 */

export interface ConflictData {
  local: any;
  remote: any;
  entity: string;
  entityId: string;
}

export const conflictDetector = {
  /**
   * Checks if a local change and a remote change can be merged automatically.
   * A "Safe Merge" happens when the fields modified locally are different from the ones modified remotely.
   */
  canAutoMerge(local: any, remote: any, lastKnownRemote: any): boolean {
    if (!lastKnownRemote) return false;

    // Identify which fields were changed locally
    const localDiff = this.getDiff(lastKnownRemote, local);
    
    // Identify which fields were changed remotely
    const remoteDiff = this.getDiff(lastKnownRemote, remote);

    // Check for intersection
    const localKeys = Object.keys(localDiff);
    const remoteKeys = Object.keys(remoteDiff);
    
    const overlap = localKeys.filter(key => remoteKeys.includes(key));
    
    // If no overlapping fields, it's a safe merge
    return overlap.length === 0;
  },

  /**
   * Merges local and remote data, giving priority to local changes.
   */
  merge(local: any, remote: any): any {
    return {
      ...remote,
      ...local,
    };
  },

  getDiff(base: any, current: any): any {
    const diff: any = {};
    for (const key in current) {
      if (JSON.stringify(base[key]) !== JSON.stringify(current[key])) {
        diff[key] = current[key];
      }
    }
    return diff;
  }
};
