import type { AssetId } from "$lib/server/objects/asset";
import { encodeAssetId } from "$lib/util/assetId";

export type ClientDeserializableAsset = {
  id: AssetId,
  creation_date: Date,
  name: string,
  alt_text: string | null,
  mime_type: string,
  width: number,
  height: number,
}

export class ClientAsset {
  static deserialize(asset: ClientDeserializableAsset): ClientAsset {
    return new ClientAsset(asset);
  }

  static async create(file: File): Promise<ClientAsset> {
    let result = await fetch("/asset/upload", { method: "PUT", body: file });

    return ClientAsset.deserialize(await result.json());
  }

  constructor(private asset: ClientDeserializableAsset) {}

  get id(): AssetId { return this.asset.id; }
  get creationDate(): Date { return this.asset.creation_date; }
  get name(): string { return this.asset.name; }
  get altText(): string | null { return this.asset.alt_text; }
  get mimeType(): string { return this.asset.mime_type; }
  get width(): number { return this.asset.width; }
  get height(): number { return this.asset.height; }

  get url(): string {
    return `/asset/${encodeAssetId(this.id)}`;
  }
}