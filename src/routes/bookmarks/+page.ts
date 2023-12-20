import { ClientTweet } from '$lib/client/objects/tweet.js';

/** @type {import('./$types').PageClientLoad} */
export async function load({ data }) {
    const bookmarks = data.self.map(tweet => ClientTweet.deserialize(tweet));
	return {
		self: bookmarks,
	};
}