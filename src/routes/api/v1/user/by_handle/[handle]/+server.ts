import { ServerSession } from "$lib/server/objects/session";
import { ServerUser } from "$lib/server/objects/user";

ServerUser
/** @type {import("./$types").RequestHandler} */
export async function GET({ params, cookies }) {
  const user = await ServerUser.loadLossy({ handle: params.handle });

  const session = await ServerSession.fromCookies(cookies);

  return new Response(JSON.stringify(await user?.serializeForFrontend(session?.user)));
}