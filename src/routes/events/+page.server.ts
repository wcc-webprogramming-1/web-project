import { ServerEvent } from '$lib/server/objects/event.js';
import { ServerSession } from '$lib/server/objects/session.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  let self = await ServerSession.load(event.cookies.get("session")!);

  let now = Date.now();
  let timeframe = 1000 * 60 * 60 * 24 * 7; // 7 days

  let events = await ServerEvent.loadTimeframe({ subject: self.user.id }, new Date(now - timeframe), new Date(now));

  return {
    events: await Promise.all(events.map(event => event.serializeForFrontend())),
  };
}