import * as db from '$lib/server/database';
import { ServerUser } from '$lib/server/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    let user = await ServerUser.load({ handle: params.user_handle });
    let followers = await user.loadFollowers();
    let followersDeserialized = followers.map(follower => follower.serializeForFrontend());

	return {
		self: await user.serializeForFrontend(),
        followers: await Promise.all(followersDeserialized),
	};
}