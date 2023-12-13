import { ServerUser } from "$lib/server/objects/user";

ServerUser
/** @type {import("./$types").RequestHandler} */
export async function GET({params}) {
    const user = await ServerUser.load({id: parseInt(params.user_id)});
    const following = await user.loadFollowing();
    const serializedFollowing = following.map(user => user.serializeForFrontend());
    const results = await Promise.all(serializedFollowing);

    return new Response(JSON.stringify(results));
}