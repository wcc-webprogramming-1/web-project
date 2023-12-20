import { ClientTweet } from '$lib/client/objects/tweet';
import { ClientUser } from '$lib/client/objects/user.js';

/** @type {import('./$types').PageClientLoad} */
export async function load({ data }) {
	return {
		self: ClientUser.deserialize(data.self),
		tweets: data.tweets.map(tweet => ClientTweet.deserializeFromComment(tweet)),
	};
}