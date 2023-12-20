import { ServerSession } from "$lib/server/objects/session";
import { ServerUser } from "$lib/server/objects/user";

/** @type {import("./$types").RequestHandler} */
export async function POST({ params, cookies }) {
  const id = parseInt(params.user_id);

  if (isNaN(id))
    return new Response(JSON.stringify(undefined));

  const user = await ServerUser.loadLossy({ id });

  if (!user)
    return new Response(JSON.stringify(undefined));

  const session = await ServerSession.fromCookies(cookies);

  if (!session)
    return new Response(JSON.stringify(undefined));

  await session.user.unfollow(user);

  return new Response(JSON.stringify(await user.serializeForFrontend(session?.user)));
}