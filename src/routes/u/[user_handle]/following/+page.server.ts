import * as db from '$lib/server/database';
import { ServerUser } from '$lib/server/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    let user = await ServerUser.load({ handle: params.user_handle });
    let following = await user.loadFollowing();
    let followingDeserialized = following.map(following => following.serializeForFrontend());

	return {
		self: await user.serializeForFrontend(),
        following: await Promise.all(followingDeserialized),
	};
}