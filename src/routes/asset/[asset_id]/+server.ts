import { ServerAsset } from "$lib/server/objects/asset";
import { decodeAssetId } from "$lib/util/assetId";

/** @type {import("./$types").RequestHandler} */
export async function GET(evt) {
  let assetId = decodeAssetId(evt.params.asset_id);
  let asset = await ServerAsset.load(assetId);

  return new Response(
    await asset.getContent(),
    {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(await asset.getContentSize()),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${asset.name.split('"').join('\\"')}"`,
      },
    },
  );
}