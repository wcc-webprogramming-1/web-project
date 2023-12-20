import { ServerUser } from "$lib/server/objects/user";

ServerUser
/** @type {import("./$types").RequestHandler} */
export async function GET({ params }) {
  const user = await ServerUser.loadLossy({ handle: params.handle });

  return new Response(JSON.stringify(await user?.serializeForFrontend()));
}