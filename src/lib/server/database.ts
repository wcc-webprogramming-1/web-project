import type { PoolConnection } from "mariadb";
import { getOrCreateDatabaseContext } from "./getDatabaseContext";

let DID_NOT_FINISH = Symbol("DID_NOT_FINISH");

export class Database {
  static async withConnection<T>(cb: (connection: PoolConnection) => T | Promise<T>): Promise<T> {
    const pool = getOrCreateDatabaseContext();
    const conn = await pool.getConnection();

    let result: typeof DID_NOT_FINISH | T = DID_NOT_FINISH;

    try {
      result = await cb(conn);
    } finally {
      conn.release();
    }

    if (result !== DID_NOT_FINISH)
      return result;

    throw new Error("Database.withConnection: callback failed");
  }

  static async query<T>(query: string, params?: any[]): Promise<T[]> {
    return await Database.withConnection(async conn => await conn.query(query, params));
  }
}