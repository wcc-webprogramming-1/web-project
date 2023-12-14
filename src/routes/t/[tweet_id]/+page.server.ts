import { ServerTweet } from '$lib/server/objects/tweet.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const tweet = await ServerTweet.load({id: parseInt(params.tweet_id)});
    const tweetSerialized = await tweet.serializeForFrontend();

    return {
        self: tweetSerialized,
    }
}