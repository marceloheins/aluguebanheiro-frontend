// src/features/driver/hooks/useLocalDispatches.ts
import { useState, useEffect } from 'react';
import { getDb } from '../../../services/database';

export interface LocalDispatchItem {
  id: string;
  dispatchId: string;
  status: string;
  notes: string;
  synced: number;
}

export function useLocalDispatches() {
  const [dispatches, setDispatches] = useState<LocalDispatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDispatches = () => {
    try {
      const db = getDb();
      const results = db.getAllSync(
        `SELECT * FROM local_dispatches ORDER BY id DESC;`
      ) as LocalDispatchItem[];
      
      setDispatches(results);
    } catch (error) {
      console.error('Erro ao buscar OS locais:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

  return { dispatches, isLoading, refresh: fetchDispatches };
}