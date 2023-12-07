import * as db from '$lib/server/database';
import { ServerAsset } from '$lib/server/objects/asset.js';
import { ServerUser } from '$lib/server/objects/user.js';
import { decodeAssetId } from '$lib/util/assetId.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  return {
    self: await ServerAsset.loadForClient(decodeAssetId(params.asset_id))
  };
}