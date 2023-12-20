import * as db from '$lib/server/database';
import { ServerTweet } from '$lib/server/objects/tweet.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {
	const tweets = await ServerTweet.loadSet({ parentId: null });
	const promise_tweets_serialized = tweets.map(tweet => tweet.serializeForFrontend());
	const tweets_serialized = await Promise.all(promise_tweets_serialized);
	return {
		self: tweets_serialized,
	};
}