import type { ClientDeserializableAsset } from "$lib/client/objects/asset";
import { decodeAssetId, encodeAssetId } from "$lib/util/assetId";
import { Database } from "../database";
import { ServerUser } from "./user";
import crypto from "node:crypto";
import findImageType from "image-type";
import imageSize from "image-size";
import fs from "node:fs";

export type AssetId = number[];

export type AssetRow = {
  id: Buffer,
  publisher_user: number,
  creation_date: Date,
  name: string,
  alt_text: string | null,
  mime_type: string,
  width: number,
  height: number,
  filepath: string,
}

export class ServerAsset {
  public static async load(assetId: AssetId): Promise<ServerAsset> {
    let attempt = await ServerAsset.tryLoad(assetId);

    if (attempt === undefined)
      throw new Error("Asset not found");

    return attempt;
  }

  public static async loadForClient(assetId: AssetId): Promise<ClientDeserializableAsset> {
    const asset = await ServerAsset.load(assetId);

    return await asset.serializeForFrontend();
  }

  public static async tryLoad(assetId: AssetId): Promise<ServerAsset | undefined> {
    const assetRow = await Database.query<AssetRow>("SELECT * FROM asset WHERE id = ?", [Buffer.from(assetId)]);

    if (assetRow.length === 0)
      return undefined;

    if (assetRow.length > 1)
      throw new Error("Ambiguous Input: Multiple assets found");

    return new ServerAsset(assetRow[0]);
  }

  public static async create(data: Uint8Array, publisherId: number, name: string, altText: string | undefined = undefined): Promise<ServerAsset> {
    let id = decodeAssetId(crypto.createHash("sha256").update(data).digest("hex"));
    let existingAsset = await ServerAsset.tryLoad(id);

    if (existingAsset !== undefined)
      return existingAsset;

    let imageType = await findImageType(data);

    if (imageType == undefined)
      throw new Error("Invalid image");

    let size = imageSize(Buffer.from(data));

    if (size.width == undefined || size.height == undefined)
      throw new Error("Invalid image");

    let filepath = `./assets/${encodeAssetId(id)}.${imageType.ext}`;
    
    fs.writeFileSync(filepath, data);

    let assetRow = {
      id,
      publisher_user: publisherId,
      name: name,
      alt_text: altText ?? null,
      mime_type: imageType.mime,
      width: size.width,
      height: size.height,
      filepath,
    };

    await Database.query(`INSERT INTO asset (
      id,
      publisher,
      name,
      alt_text,
      mime_type,
      width,
      height,
      filepath
    ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )`, [
      Buffer.from(assetRow.id),
      assetRow.publisher_user,
      assetRow.name,
      assetRow.alt_text,
      assetRow.mime_type,
      assetRow.width,
      assetRow.height,
      assetRow.filepath,
    ]);

    return await this.load(assetRow.id);
  }

  constructor(private assetRow: AssetRow) {}

  get id(): AssetId { return Array.from(this.assetRow.id); }
  encodeAssetId(): string { return encodeAssetId(this.id); }
  get publisherUserId(): number { return this.assetRow.publisher_user; }
  loadPublisherUser(): Promise<ServerUser> { return ServerUser.load({ id: this.publisherUserId }); }
  get creationDate(): Date { return this.assetRow.creation_date; }
  get name(): string { return this.assetRow.name; }
  get altText(): string | null { return this.assetRow.alt_text; }
  get mimeType(): string { return this.assetRow.mime_type; }
  get width(): number { return this.assetRow.width; }
  get height(): number { return this.assetRow.height; }
  get filepath(): string { return this.assetRow.filepath; }

  serializeForFrontend(): ClientDeserializableAsset {
    return {
      id: this.id,
      creation_date: this.creationDate,
      name: this.name,
      alt_text: this.altText,
      mime_type: this.mimeType,
      width: this.width,
      height: this.height,
    };
  }

  async getContent(): Promise<Buffer> {
    return await fs.promises.readFile(this.filepath);
  }

  async getContentSize(): Promise<number> {
    const info = await fs.promises.stat(this.filepath);

    return info.size;
  }
}