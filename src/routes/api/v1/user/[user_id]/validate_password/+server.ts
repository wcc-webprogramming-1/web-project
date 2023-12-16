import { ServerUser } from "$lib/server/objects/user";

ServerUser
/** @type {import("./$types").RequestHandler} */
export async function POST({ params, request }) {
  const id = parseInt(params.user_id);

  if (isNaN(id))
    return new Response(JSON.stringify(false));

  const user = await ServerUser.loadLossy({ id });

  if (!user)
    return new Response(JSON.stringify(false));

  const req = await request.json();

  return new Response(JSON.stringify(await user.validatePassword(req.password)));
}