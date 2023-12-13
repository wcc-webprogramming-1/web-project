import { ServerSession } from '$lib/server/objects/session';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const session_token = event.cookies.get("session")

  if (session_token == null) {
    event.cookies.delete("session");
    event.locals.session = undefined;

    return await resolve(event);
  }

  const session = await ServerSession.load(session_token);
  event.locals.session = session;

  return await resolve(event);
}