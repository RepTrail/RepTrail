
export interface Conflict {
  id: string; // Outbox record ID
  entity: string;
  entityId: string;
  localData: any;
  remoteData: any;
  action: string;
  timestamp: number;
}

type Subscriber = (conflicts: Conflict[]) => void;

class ConflictStore {
  private conflicts: Conflict[] = [];
  private subscribers: Set<Subscriber> = new Set();

  addConflict(conflict: Conflict) {
    // Avoid duplicates for the same entity/action
    this.conflicts = this.conflicts.filter(c => c.entityId !== conflict.entityId || c.action !== conflict.action);
    this.conflicts.push(conflict);
    this.notify();
  }

  resolveConflict(id: string) {
    this.conflicts = this.conflicts.filter(c => c.id !== id);
    this.notify();
  }

  getConflicts() {
    return this.conflicts;
  }

  subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
    return () => { this.subscribers.delete(callback); };
  }

  private notify() {
    this.subscribers.forEach(sub => sub(this.conflicts));
  }
}

export const conflictStore = new ConflictStore();
