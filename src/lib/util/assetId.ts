import type { AssetId } from "$lib/server/objects/asset";

export function encodeAssetId(assetId: AssetId): string {
  return assetId.map((n) => n.toString(16).padStart(2, "0")).join("");
}

export function decodeAssetId(assetId: string): AssetId {
  if (assetId.length % 2 !== 0)
    throw new Error("Invalid asset ID");

  const result: AssetId = [];

  for (let i = 0; i < assetId.length; i += 2) {
    result.push(parseInt(assetId.slice(i, i + 2), 16));
  }

  return result;
}

