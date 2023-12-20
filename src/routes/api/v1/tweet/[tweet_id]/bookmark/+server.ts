import { ServerSession } from '$lib/server/objects/session.js';
import { ServerTweet } from '$lib/server/objects/tweet';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, cookies }) {
    const tweet = await ServerTweet.load({id: parseInt(params.tweet_id)})
    const self = await ServerSession.load(cookies.get("session")!);
    const event = await tweet.toggleBookmark(self.user);

  return new Response(JSON.stringify({
    bookmark: await tweet.getBookmarkCount(),
    is_bookmarked_by_user: tweet.getBookmarkState(tweet),
  }));

}
