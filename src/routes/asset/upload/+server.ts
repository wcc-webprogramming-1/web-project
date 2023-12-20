import { ServerAsset } from "$lib/server/objects/asset";
import { ServerSession } from "$lib/server/objects/session";
import { decodeAssetId } from "$lib/util/assetId";

/** @type {import("./$types").RequestHandler} */
export async function PUT(evt) {
  const body = new Uint8Array(await evt.request.arrayBuffer());

  if (body === undefined)
    return new Response(JSON.stringify({ type: "error", error: "No Body" }), { status: 400 });

  //TODO: proper publisher id!!!
  const asset = await ServerAsset.create(body, 0, evt.url.searchParams.get("name") ?? "unnamed", evt.url.searchParams.get("alt_text") ?? undefined);

  return new Response(
    JSON.stringify(asset.serializeForFrontend()),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}