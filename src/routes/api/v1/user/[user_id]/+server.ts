import { ServerUser } from "$lib/server/objects/user";

ServerUser
/** @type {import("./$types").RequestHandler} */
export async function GET({ params }) {
  const id = parseInt(params.user_id);

  if (isNaN(id))
    return new Response(JSON.stringify(undefined));

  const user = await ServerUser.loadLossy({ id });

  return new Response(JSON.stringify(await user?.serializeForFrontend()));
}