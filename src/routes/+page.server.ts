import * as db from '$lib/server/database';
import { ServerTweet } from '$lib/server/objects/tweet.js';
import { ServerUser } from '$lib/server/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {
	const tweets = ServerTweet.loadSet({ })
	return {

	};
}