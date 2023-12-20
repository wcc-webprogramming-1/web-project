import { ServerSession } from '$lib/server/objects/session.js';
import { ServerTweet } from '$lib/server/objects/tweet';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, cookies }) {
  const tweet = await ServerTweet.load({ id: parseInt(params.tweet_id) });
  const self = await ServerSession.load(cookies.get("session")!);
  const event = await tweet.toggleLike(self.user);

  return new Response(JSON.stringify({
    likes: tweet.likes,
    is_liked_by_user: await tweet.getLikedBy(self.user) !== undefined
  }));
}
