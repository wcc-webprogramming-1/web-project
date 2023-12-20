import { ServerSession } from "$lib/server/objects/session";
import { ServerUser } from "$lib/server/objects/user";

    /** @type {import("./$types").RequestHandler} */
export async function GET({params, cookies}) {
    const user = await ServerUser.load({id: parseInt(params.user_id)});
    const followers = await user.loadFollowers();
    const session = await ServerSession.fromCookies(cookies);
    const serializedFollowers = followers.map(user => user.serializeForFrontend(session?.user));
    const results = await Promise.all(serializedFollowers);

    return new Response(JSON.stringify(results));
}