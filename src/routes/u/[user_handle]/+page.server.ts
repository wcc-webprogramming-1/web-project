import * as db from '$lib/server/database';
import { ServerUser } from '$lib/server/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		self: await ServerUser.loadForClient({ handle: params.user_handle })
	};
}