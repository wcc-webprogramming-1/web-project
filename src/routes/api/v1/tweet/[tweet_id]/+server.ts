import { ServerSession } from "$lib/server/objects/session";
import { ServerTweet } from "$lib/server/objects/tweet";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, cookies }) {
  let tweet = await ServerTweet.load({ id: parseInt(params.tweet_id) });
  const session = await ServerSession.fromCookies(cookies);

  return new Response(JSON.stringify(await tweet.serializeForFrontend(session?.user)));
}