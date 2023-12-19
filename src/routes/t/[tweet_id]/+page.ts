import { ClientTweet } from '$lib/client/objects/tweet.js';

/** @type {import('./$types').PageClientLoad} */
export async function load({ data }) {
	return {
		self: ClientTweet.deserialize(data.self),
		comments: data.commentArray.map(comment => ClientTweet.deserialize(comment)),
	};
}