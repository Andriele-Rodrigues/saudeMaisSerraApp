import type { SQLiteDatabase } from 'expo-sqlite';
import { SCHEMA_V1 } from './schema';
import { seedInicial } from './seed';

const VERSAO_ATUAL = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const resultado = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const versaoBanco = resultado?.user_version ?? 0;

  if (versaoBanco >= VERSAO_ATUAL) {
    return;
  }

  if (versaoBanco === 0) {
    await db.execAsync(SCHEMA_V1);
    await seedInicial(db);
  }

  await db.execAsync(`PRAGMA user_version = ${VERSAO_ATUAL}`);
}
