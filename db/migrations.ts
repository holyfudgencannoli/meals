// src/data/db/migrations.ts
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec } from "./utils";

export type table = {
	name: string
}

type TableColumn = {
  name: string;
}

const ENTRY_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    body        TEXT NOT NULL,
    image_uri   TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL
  );
`;

async function migrateEntriesTable(db: SQLiteDatabase) {
  const entryTables = await db.getAllAsync<table>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='entries';`
  );

  if (entryTables.length === 0) {
    await safeExec(db, ENTRY_TABLE_SQL);
    return;
  }

  const columns = await db.getAllAsync<TableColumn>("PRAGMA table_info(entries);");
  const columnNames = new Set(columns.map((column) => column.name));

  const hasCurrentSchema =
    columnNames.has("title") &&
    columnNames.has("body") &&
    columnNames.has("image_uri") &&
    columnNames.has("created_at") &&
    !columnNames.has("start") &&
    !columnNames.has("end");

  if (hasCurrentSchema) {
    return;
  }

  const titleColumn = columnNames.has("title") ? "title" : "''";
  const bodyColumn = columnNames.has("body") ? "body" : "''";
  const imageColumn = columnNames.has("image_uri")
    ? "image_uri"
    : columnNames.has("image_url")
      ? "image_url"
      : "''";
  const createdAtColumn = columnNames.has("created_at") ? "created_at" : "CURRENT_TIMESTAMP";

  await safeExec(db, "DROP TABLE IF EXISTS entries_legacy;");
  await safeExec(db, "ALTER TABLE entries RENAME TO entries_legacy;");
  await safeExec(db, ENTRY_TABLE_SQL);
  await safeExec(
    db,
    `
      INSERT INTO entries (id, title, body, image_uri, created_at)
      SELECT id, ${titleColumn}, ${bodyColumn}, ${imageColumn}, ${createdAtColumn}
      FROM entries_legacy;
    `
  );
  await safeExec(db, "DROP TABLE entries_legacy;");
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;

  const { user_version } = await db.getFirstAsync<{ user_version: number | null }>(
    "PRAGMA user_version"
  );


  if (user_version >= DATABASE_VERSION) return;

  await safeExec(db, "PRAGMA journal_mode = 'wal';")
  await migrateEntriesTable(db);
  await safeExec(db, "PRAGMA foreign_keys = ON;");
  await safeExec(db, `PRAGMA user_version = ${DATABASE_VERSION}`);

  const tables: table[] = await db.getAllAsync(
    `SELECT name FROM sqlite_master WHERE type='table';`
  );

  console.log("Tables in DB:", tables.map(t => t.name));
  
  

	// new tables here for immediate run; then move inside conditional
      
}
