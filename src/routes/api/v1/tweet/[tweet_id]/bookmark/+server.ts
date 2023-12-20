import { ServerSession } from '$lib/server/objects/session.js';
import { ServerTweet } from '$lib/server/objects/tweet';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, cookies }) {
    const tweet = await ServerTweet.load({id: parseInt(params.tweet_id)})
    const self = await ServerSession.load(cookies.get("session")!);
    const event = await tweet.toggleBookmark(self.user);

  return new Response(JSON.stringify({
    bookmar: tweet.bookmarks,
    is_bookmarked_by_user: await tweet.getBookmarkBy(self.user) !== undefined
  }));

}
