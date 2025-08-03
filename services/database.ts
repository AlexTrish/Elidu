import * as SQLite from 'expo-sqlite';
import { CrashLogger } from './crashLogger';

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
    try {
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
    } catch (error) {
      CrashLogger.logError(error as Error, 'Database Init');
      throw error;
    }
  },

  async getUniversities(): Promise<DBUniversity[]> {
    try {
      const db = await getDb();
      const result = await db.getAllAsync<DBUniversity>('SELECT * FROM universities;');
      return result;
    } catch (error) {
      CrashLogger.logError(error as Error, 'Get Universities');
      return [];
    }
  },

  async getPrograms(): Promise<DBProgram[]> {
    try {
      const db = await getDb();
      const result = await db.getAllAsync<DBProgram>('SELECT * FROM programs;');
      return result;
    } catch (error) {
      CrashLogger.logError(error as Error, 'Get Programs');
      return [];
    }
  },

  async addUniversity(university: DBUniversity) {
    try {
      const db = await getDb();
      await db.runAsync(
        'INSERT INTO universities (id, name, url) VALUES (?, ?, ?);',
        university.id, university.name, university.url
      );
    } catch (error) {
      CrashLogger.logError(error as Error, 'Add University');
      throw error;
    }
  },

  async updateUniversity(university: DBUniversity) {
    try {
      const db = await getDb();
      await db.runAsync(
        'UPDATE universities SET name = ?, url = ? WHERE id = ?;',
        university.name, university.url, university.id
      );
    } catch (error) {
      CrashLogger.logError(error as Error, 'Update University');
      throw error;
    }
  },

  async deleteUniversity(id: string) {
    try {
      const db = await getDb();
      await db.runAsync('DELETE FROM universities WHERE id = ?;', id);
      await db.runAsync('DELETE FROM programs WHERE universityId = ?;', id);
    } catch (error) {
      CrashLogger.logError(error as Error, 'Delete University');
      throw error;
    }
  },

  async addProgram(program: DBProgram) {
    try {
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
    } catch (error) {
      CrashLogger.logError(error as Error, 'Add Program');
      throw error;
    }
  },

  async updateProgram(program: DBProgram) {
    try {
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
    } catch (error) {
      CrashLogger.logError(error as Error, 'Update Program');
      throw error;
    }
  },

  async deleteProgram(id: string) {
    try {
      const db = await getDb();
      await db.runAsync('DELETE FROM programs WHERE id = ?;', id);
    } catch (error) {
      CrashLogger.logError(error as Error, 'Delete Program');
      throw error;
    }
  },
};

Database.init();