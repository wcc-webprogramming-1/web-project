import { WebsocketSession } from '$lib/server/socket/session.js';

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  WebsocketSession.broadcast({
    type: "event",
    content: {
      id: 0,
      actor: {
        handle: "demo",
        username: "Demo User",
        id: 1,
        creation_date: Date.now(),
        bio: "Demo bio for user 0",
        profile_asset: undefined,
        banner_asset: undefined,
      },
      type: 0,
      subject: {
        handle: "demo",
        username: "Demo User",
        id: 1,
        creation_date: Date.now(),
        bio: "Demo bio for user 0",
        profile_asset: undefined,
        banner_asset: undefined,
      },
      time: Date.now(),
      post: undefined,
    }
  })

  return new Response(JSON.stringify({}));
}
