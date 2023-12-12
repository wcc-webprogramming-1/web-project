import type { ClientDeserializableUser } from "$lib/client/objects/user";
import { Database } from "../database"
import bcrypt from "bcrypt";
import { ServerAsset } from "./asset";

const PASSWORD_SALT_ROUNDS = 10;

export type UserRow = {
  handle: string,
  username: string,
  creation_date: Date,
  id: number,
  bio: string,
  profile_asset_id: number[] | undefined,
  banner_asset_id: number[] | undefined,
  password: string,
}

export type UserConstructionParameters = {
  handle: string,
  username: string,
  creation_date?: Date,
  id?: number,
  bio: string,
  profile_asset_id?: number[] | undefined,
  banner_asset_id?: number[] | undefined,
  password: string,
}

export class ServerUser {
  static async load(using: Partial<UserRow>): Promise<ServerUser> {
    const query = `SELECT * FROM users WHERE ${Object.keys(using).map(key => `${key} = ?`).join(" AND ")}`;
    const params = Object.values(using)
    const userRow = await Database.query<UserRow>(query, params);

    if (userRow.length === 0)
      throw new Error("User not found");

    if (userRow.length > 1)
      throw new Error("Ambiguous Input: Multiple users found");
    
    return new ServerUser(userRow[0]);
  }

  static async loadForClient(using: Partial<UserRow>): Promise<ClientDeserializableUser> {
    const user = await ServerUser.load(using);

    return user.serializeForFrontend();
  }

  static async create(constructionParameters: UserConstructionParameters): Promise<ServerUser> {
    const hashedPassword = await bcrypt.hash(constructionParameters.password, PASSWORD_SALT_ROUNDS);

    let query = "INSERT INTO users (";
    const params: any[] = [];

    for (const [key, value] of Object.entries(constructionParameters)) {
      query += `${key}, `;

      if (key === "password")
        params.push(hashedPassword);
      else
        params.push(value);
    }

    query = query.slice(0, -2);

    query += ") VALUES (";

    for (const _ of params) {
      query += "?, ";
    }

    query = query.slice(0, -2);

    query += ")";

    const result = await Database.query<UserRow>(query, params);
    const userRow = await Database.query<UserRow>("@@IDENTITY");

    return new ServerUser(userRow[0]);
  }

  constructor(private row: UserRow) {}

  async serializeForFrontend(): Promise<ClientDeserializableUser> {
    const profileAsset = this.row.profile_asset_id && await this.loadProfileAsset();
    const bannerAsset = this.row.banner_asset_id && await this.loadBannerAsset();

    return {
      handle: this.handle,
      username: this.username,
      creation_date: this.creationDate,
      id: this.id,
      bio: this.bio,
      profile_asset: profileAsset && await profileAsset.serializeForFrontend(),
      banner_asset: bannerAsset && await bannerAsset.serializeForFrontend(),
    }
  }

  get handle() { return this.row.handle; }
  get username() { return this.row.username; }
  get creationDate() { return this.row.creation_date; }
  get id() { return this.row.id; }
  get bio() { return this.row.bio; }

  loadProfileAsset(): Promise<ServerAsset | undefined> {
    if (this.row.profile_asset_id === undefined)
      return Promise.resolve(undefined);

    return ServerAsset.load(this.row.profile_asset_id);
  }

  loadBannerAsset(): Promise<ServerAsset | undefined> {
    if (this.row.banner_asset_id === undefined)
      return Promise.resolve(undefined);

    return ServerAsset.load(this.row.banner_asset_id);
  }
  
  validatePassword(checkPassword: string): Promise<boolean> {
    return bcrypt.compare(checkPassword, this.row.password);
  }

  async setPassword(newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);

    await Database.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, this.id]);
  }

  async setBio(newBio: string): Promise<void> {
    await Database.query("UPDATE users SET bio = ? WHERE id = ?", [newBio, this.id]);
  }

  async setUsername(newUsername: string): Promise<void> {
    await Database.query("UPDATE users SET username = ? WHERE id = ?", [newUsername, this.id]);
  }
}