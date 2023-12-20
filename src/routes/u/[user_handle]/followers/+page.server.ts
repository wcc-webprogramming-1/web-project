import * as db from '$lib/server/database';
import { ServerSession } from '$lib/server/objects/session';
import { ServerUser } from '$lib/server/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
    let user = await ServerUser.load({ handle: params.user_handle });
    const session = await ServerSession.fromCookies(cookies);
    let followers = await user.loadFollowers();
    let followersDeserialized = followers.map(follower => follower.serializeForFrontend(session?.user));

	return {
		self: await user.serializeForFrontend(session?.user),
        followers: await Promise.all(followersDeserialized),
	};
}