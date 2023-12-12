import { ServerTweet } from '$lib/server/objects/tweet';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
    let tweet = await ServerTweet.load({ id: parseInt(params.tweet_id) });
	let comments = await tweet.loadComments();
	let serializableCommentsProms = comments.map(c => c.serializeForFrontend());
	let serializableComments = await Promise.all(serializableCommentsProms);

	return new Response(JSON.stringify(serializableComments));
}
