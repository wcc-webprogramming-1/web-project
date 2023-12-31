import { ServerSession } from "$lib/server/objects/session";
import { ServerUser } from "$lib/server/objects/user";

/** @type {import("./$types").RequestHandler} */
export async function GET({ params, cookies }) {
  const id = parseInt(params.user_id);

  if (isNaN(id))
    return new Response(JSON.stringify(undefined));

  const user = await ServerUser.loadLossy({ id });

  const session = await ServerSession.fromCookies(cookies);

  return new Response(JSON.stringify(await user?.serializeForFrontend(session?.user)));
}