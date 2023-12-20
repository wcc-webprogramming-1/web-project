import { ServerSession } from "$lib/server/objects/session";
import { ServerUser } from "$lib/server/objects/user";

ServerUser
/** @type {import("./$types").RequestHandler} */
export async function GET({params, cookies}) {
    const user = await ServerUser.load({id: parseInt(params.user_id)});
    const following = await user.loadFollowing();
    const session = await ServerSession.fromCookies(cookies);
    const serializedFollowing = following.map(user => user.serializeForFrontend(session?.user));
    const results = await Promise.all(serializedFollowing);

    return new Response(JSON.stringify(results));
}