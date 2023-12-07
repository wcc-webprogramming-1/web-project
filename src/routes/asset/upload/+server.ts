import { ServerAsset } from "$lib/server/objects/asset";
import { decodeAssetId } from "$lib/util/assetId";

/** @type {import("./$types").RequestHandler} */
export async function PUT(evt) {
  const body = await evt.request.body?.getReader().read();

  if (body === undefined || body.value === undefined)
    return new Response(JSON.stringify({ type: "error", error: "No Body" }), { status: 400 });

  //TODO: proper publisher id!!!
  const asset = await ServerAsset.create(body.value!, 0, evt.url.searchParams.get("name") ?? "unnamed", evt.url.searchParams.get("alt_text") ?? undefined);

  return new Response(
    JSON.stringify(asset.serializeForFrontend()),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}