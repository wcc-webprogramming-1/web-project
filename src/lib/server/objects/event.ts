import type { ClientDeserializableEvent, EventType } from "$lib/client/objects/event";
import { Database } from "../database";
import { ServerTweet } from "./tweet";
import { ServerUser } from "./user";

export type EventRow = {
  id: number,
  actor: number,
  type: number,
  subject: number,
  time: Date,
  post: number | null,
}

export type EventConstructionParameters = {
  actor: number,
  type: number,
  subject: number,
  time?: Date,
  post?: number | null,
}

export class ServerEvent {
  static async loadLossy(using: Partial<EventRow>): Promise<ServerEvent | undefined> {
    const query = `SELECT * FROM events WHERE ${Object.keys(using).map(key => `${key} = ?`).join(" AND ")}`;
    const params = Object.values(using)
    const eventRow = await Database.query<EventRow>(query, params);

    if (eventRow.length > 1)
      throw new Error("Ambiguous Input: Multiple events found");
    
    return new ServerEvent(eventRow[0]);
  }

  static async load(using: Partial<EventRow>): Promise<ServerEvent> {
    const event = await ServerEvent.loadLossy(using);

    if (event === undefined)
      throw new Error("Event not found");

    return event;
  }

  static async loadForClient(using: Partial<EventRow>): Promise<ClientDeserializableEvent> {
    const event = await ServerEvent.load(using);

    return event.serializeForFrontend();
  }

  static async loadSet(using: Partial<EventRow>): Promise<ServerEvent[]> {
    const query = `SELECT * FROM events WHERE ${Object.keys(using).map(key => `${key} = ?`).join(" AND ")}`;
    const params = Object.values(using)
    const eventRows = await Database.query<EventRow>(query, params);

    return eventRows.map(row => new ServerEvent(row));
  }

  static async loadSetForClient(using: Partial<EventRow>): Promise<ClientDeserializableEvent[]> {
    const events = await ServerEvent.loadSet(using);

    return await Promise.all(events.map(event => event.serializeForFrontend()));
  }

  static async create(constructionParameters: EventConstructionParameters): Promise<ServerEvent> {
    let query = "INSERT INTO events (";

    const keys = Object.keys(constructionParameters);
    const values = Object.values(constructionParameters);

    query += keys.join(", ");
    query += ") VALUES (";
    query += keys.map(() => "?").join(", ");
    query += ")";

    const result = await Database.query(query, values);
    const row = await Database.query<EventRow>("@@IDENTITY");

    return new ServerEvent(row[0]);
  }

  constructor(private row: EventRow) {}

  private cache_actor: ServerUser | undefined;
  private cache_subject: ServerUser | undefined;
  private cache_post: ServerTweet | undefined;

  get id(): number { return this.row.id; }
  get type(): number { return this.row.type as EventType; }
  get time(): Date { return this.row.time; }

  public async loadActor(): Promise<ServerUser> {
    if (this.cache_actor !== undefined)
      return this.cache_actor;

    return this.cache_actor = await ServerUser.load({ id: this.row.actor });
  }

  public async loadSubject(): Promise<ServerUser> {
    if (this.cache_subject !== undefined)
      return this.cache_subject;

    return this.cache_subject = await ServerUser.load({ id: this.row.subject });
  }

  public async loadPost(): Promise<ServerTweet | undefined> {
    if (this.cache_post !== undefined)
      return this.cache_post;

    if (this.row.post === null)
      return undefined;

    return this.cache_post = await ServerTweet.load({ id: this.row.post });
  }

  async serializeForFrontend(): Promise<ClientDeserializableEvent> {
    const actor = await this.loadActor();
    const subject = await this.loadSubject();
    const post = await this.loadPost();

    return {
      id: this.id,
      actor: await actor.serializeForFrontend(),
      type: this.type,
      subject: await subject.serializeForFrontend(),
      time: this.time,
      post: await post?.serializeForFrontend(),
    }
  }
}