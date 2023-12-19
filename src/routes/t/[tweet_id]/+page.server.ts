import { ServerTweet } from '$lib/server/objects/tweet.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const tweet = await ServerTweet.load({id: parseInt(params.tweet_id)});
    const tweetSerialized = await tweet.serializeForFrontend();
    const comments = await tweet.loadComments();
    const commentsDesirialized = comments.map(comment => comment.serializeForFrontend());
    const commentsDesirializedArray = await Promise.all(commentsDesirialized);

    return {
        self: tweetSerialized,
        commentArray: commentsDesirializedArray,
        maxAge: 60
    }
}