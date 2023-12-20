// HACK!!! DO NOT REMOVE!!!
import { ServerSession } from "$lib/server/objects/session";
import "$lib/server/socket/session";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, cookies }) {
  const session = await ServerSession.fromCookies(cookies);
  
  return {
    session: await locals.session?.user.serializeForFrontend(session?.user),
    token: locals.session?.id,
  };
}
