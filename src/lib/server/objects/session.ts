import { Database } from "../database"
import { ServerUser } from "./user";
import crypto from "node:crypto";

export type SessionRow = {
  session_id: string,
  user_id: number,
  start_time: Date,
  end_time: Date | null,
  ip: string,
}

export class ServerSession {
  static async load(session_token: string): Promise<ServerSession> {
    const row = await Database.query<SessionRow>("SELECT * FROM session WHERE session_id = ?", [session_token]);
    
    if (row.length === 0)
      throw new Error("Session not found");

    if (row.length > 1)
      throw new Error("Ambiguous Input: Multiple sessions found");

    const user = await ServerUser.load({ id: row[0].user_id });

    return new ServerSession(row[0], user);
  }

  static async create(user: ServerUser, ip: string): Promise<ServerSession> {
    const token = crypto.randomBytes(32).toString("hex");

    const result = await Database.query("INSERT INTO session (session_id, user_id, ip) VALUES (?, ?, ?)", [
      token,
      user.id,
      ip,
    ]);

    return new ServerSession({
      session_id: token,
      user_id: user.id,
      start_time: new Date(),
      end_time: null,
      ip,
    }, user);
  }

  constructor(
    private readonly row: SessionRow,
    public readonly user: ServerUser,
  ) {}

  async delete(session_token: string): Promise<void> {
    await Database.query("UPDATE sessions SET end_time = ? WHERE session_id = ?", [new Date(), session_token]);
    await Database.query("DELETE FROM sessions WHERE session_id = ?", [session_token]);
  }

  get id(): string { return this.row.session_id; }
  get startTimestamp(): Date { return this.row.start_time; }
  get endTimestamp(): Date | null { return this.row.end_time; }
  get ip(): string { return this.row.ip; }
}