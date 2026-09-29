// src/services/database.ts
import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados local
const db = SQLite.openDatabaseSync('saas_driver.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS local_dispatches (
      id TEXT PRIMARY KEY,
      dispatchId TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      signatureUri TEXT,
      photoUri TEXT,
      synced INTEGER DEFAULT 0
    );
  `);
}

export function getDb() {
  return db;
}