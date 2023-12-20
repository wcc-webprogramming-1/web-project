import * as db from '$lib/server/database';
import { ServerSession } from '$lib/server/objects/session';
import { ServerTweet } from '$lib/server/objects/tweet.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({params, cookies}) {
	const tweets = await ServerTweet.loadSet({ parentId: null });
	const session = await ServerSession.fromCookies(cookies);
	const promise_tweets_serialized = tweets.map(tweet => tweet.serializeForFrontend(session?.user));
	const tweets_serialized = await Promise.all(promise_tweets_serialized);
	return {
		self: tweets_serialized,
	};
}