import { ClientAsset } from '$lib/client/objects/asset.js';
import { ClientUser } from '$lib/client/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ data }) {
  return {
    self: ClientAsset.deserialize(data.self),
  };
}