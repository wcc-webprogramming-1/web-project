import { ServerEvent } from '$lib/server/objects/event.js';
import { WebsocketSession } from '$lib/server/socket/session.js';

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  let evt = await ServerEvent.create({
    actor: 1,
    subject: 1,
    type: 0,
    post: undefined,
  })

  WebsocketSession.broadcast({
    type: "event",
    content: await evt.serializeForFrontend()
  })

  return new Response(JSON.stringify({}));
}
