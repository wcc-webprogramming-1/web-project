import { ServerTweet } from "$lib/server/objects/tweet";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  let tweet = await ServerTweet.load({ id: parseInt(params.tweet_id) });

  return new Response(JSON.stringify(await tweet.serializeForFrontend()));
}