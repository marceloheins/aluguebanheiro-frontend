// src/services/offlineStorage.ts
import { getDb } from './database';

interface SaveOfflineDispatchParams {
  dispatchId: string;
  notes?: string;
  signatureUri: string;
  photoUri: string;
}

export function saveDispatchOffline({ dispatchId, notes, signatureUri, photoUri }: SaveOfflineDispatchParams) {
  const db = getDb();
  
  db.runSync(
    `INSERT OR REPLACE INTO local_dispatches (id, dispatchId, status, notes, signatureUri, photoUri, synced) 
     VALUES (?, ?, ?, ?, ?, ?, 0);`,
    [
      `${dispatchId}-${Date.now()}`,
      dispatchId,
      'COMPLETED',
      notes || '',
      signatureUri,
      photoUri,
    ]
  );
}