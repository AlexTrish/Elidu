import * as SQLite from 'expo-sqlite';

// Открываем БД асинхронно
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('elidu.db');
  }
  return dbPromise;
}

export interface DBUniversity {
  id: string;
  name: string;
  url: string;
}

export interface DBProgram {
  id: string;
  universityId: string;
  name: string;
  budgetSeats: number;
  passingScore?: number;
  contractType: 'budget' | 'contract' | 'quota';
  currentRank: number;
  originalsAbove: number;
  examScore: number;
  probability: number;
}

export const Database = {
  async init() {
    const db = await getDb();
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS universities (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        url TEXT
      );
      CREATE TABLE IF NOT EXISTS programs (
        id TEXT PRIMARY KEY NOT NULL,
        universityId TEXT,
        name TEXT,
        budgetSeats INTEGER,
        passingScore INTEGER,
        contractType TEXT,
        currentRank INTEGER,
        originalsAbove INTEGER,
        examScore INTEGER,
        probability INTEGER
      );`
    );
  },

  async getUniversities(): Promise<DBUniversity[]> {
    const db = await getDb();
    const result = await db.getAllAsync<DBUniversity>('SELECT * FROM universities;');
    return result;
  },

  async getPrograms(): Promise<DBProgram[]> {
    const db = await getDb();
    const result = await db.getAllAsync<DBProgram>('SELECT * FROM programs;');
    return result;
  },

  async addUniversity(university: DBUniversity) {
    const db = await getDb();
    await db.runAsync(
      'INSERT INTO universities (id, name, url) VALUES (?, ?, ?);',
      university.id, university.name, university.url
    );
  },

  async updateUniversity(university: DBUniversity) {
    const db = await getDb();
    await db.runAsync(
      'UPDATE universities SET name = ?, url = ? WHERE id = ?;',
      university.name, university.url, university.id
    );
  },

  async deleteUniversity(id: string) {
    const db = await getDb();
    await db.runAsync('DELETE FROM universities WHERE id = ?;', id);
    await db.runAsync('DELETE FROM programs WHERE universityId = ?;', id);
  },

  async addProgram(program: DBProgram) {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO programs 
        (id, universityId, name, budgetSeats, passingScore, contractType, currentRank, originalsAbove, examScore, probability)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      program.id,
      program.universityId,
      program.name,
      program.budgetSeats,
      program.passingScore ?? null,
      program.contractType,
      program.currentRank,
      program.originalsAbove,
      program.examScore,
      program.probability
    );
  },

  async updateProgram(program: DBProgram) {
    const db = await getDb();
    await db.runAsync(
      `UPDATE programs SET 
        name = ?, budgetSeats = ?, passingScore = ?, contractType = ?, currentRank = ?, originalsAbove = ?, examScore = ?, probability = ?
        WHERE id = ?;`,
      program.name,
      program.budgetSeats,
      program.passingScore ?? null,
      program.contractType,
      program.currentRank,
      program.originalsAbove,
      program.examScore,
      program.probability,
      program.id
    );
  },

  async deleteProgram(id: string) {
    const db = await getDb();
    await db.runAsync('DELETE FROM programs WHERE id = ?;', id);
  },
};

Database.init();