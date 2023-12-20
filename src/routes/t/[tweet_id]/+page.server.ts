import { ServerSession } from '$lib/server/objects/session';
import { ServerTweet } from '$lib/server/objects/tweet.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
    const session = await ServerSession.fromCookies(cookies);
	const tweet = await ServerTweet.load({id: parseInt(params.tweet_id)});
    const tweetSerialized = await tweet.serializeForFrontend(session?.user);
    const comments = await tweet.loadComments();
    const commentsDesirialized = comments.map(comment => comment.serializeForFrontend(session?.user));
    const commentsDesirializedArray = await Promise.all(commentsDesirialized);

    return {
        self: tweetSerialized,
        commentArray: commentsDesirializedArray,
        maxAge: 60
    }
}