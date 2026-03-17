
import { safeRun, safeSelectAll, safeSelectOne } from "@/db/utils";
import { SQLiteDatabase } from "expo-sqlite";
import { Entry } from "../types";

export async function create(db: SQLiteDatabase, params: Omit<Entry, 'id'>): Promise<number> {
  const result = await safeRun(db,
    "INSERT INTO entries (title, body, image_uri, created_at) VALUES (?, ?, ?, ?)",
    [params.title, params.body, params.image_uri, params.created_at]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase): Promise<Entry[]> {
  return await safeSelectAll<Entry>(
    db,
    "SELECT id, title, body, image_uri, created_at FROM entries ORDER BY created_at DESC, id DESC"
  );
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<Entry>(
    db,
    "SELECT id, title, body, image_uri, created_at FROM entries WHERE id = ?",
    [id]
  );
}

// export async function getAllByType(
//   db: SQLiteDatabase,
//   type: string
// ) {
//   return await safeSelectAll<EntryType>(db, "SELECT * FROM entries WHERE type = ?", [type]);
// }

export async function getByName(
  db: SQLiteDatabase,
  name: string
): Promise<Entry | null> {
  return await safeSelectOne<Entry>(
    db,
    "SELECT id, title, body, image_uri, created_at FROM entries WHERE title = ?",
    [name]
  );
}


export async function update(
  db: SQLiteDatabase, 
  data: {
    id: number; 
    params: Partial<Entry>
  }) {
  const { id, params } = data;

  const setClauses: string[] = [];
  const values: any[] = [];

  for (const key of Object.keys(params) as Array<keyof Omit<Entry, 'id'>>) {
    const value = params[key];
    if (value !== undefined) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return 0; // nothing to update

  values.push(id); // for WHERE clause
  const query = `UPDATE entries SET ${setClauses.join(', ')} WHERE id = ?`;

  const result = await safeRun(db, query, values);
  return result.changes;
}


export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM entries WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number): Promise<boolean> {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM entries WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}


const entryService = {
  create,
  readAll,
  getById,
  getByName,
  update,
  destroy,
  exists
};

export default entryService