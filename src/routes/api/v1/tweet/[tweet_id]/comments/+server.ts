import { ServerSession } from '$lib/server/objects/session';
import { ServerTweet } from '$lib/server/objects/tweet';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, cookies }) {
	let tweet = await ServerTweet.load({ id: parseInt(params.tweet_id) });
	let comments = await tweet.loadComments();
	const session = await ServerSession.fromCookies(cookies);
	let serializableCommentsProms = comments.map(c => c.serializeForFrontend(session?.user));
	let serializableComments = await Promise.all(serializableCommentsProms);

	return new Response(JSON.stringify(serializableComments));
}
