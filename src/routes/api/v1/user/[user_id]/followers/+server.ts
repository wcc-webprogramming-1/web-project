import { ServerUser } from "$lib/server/objects/user";

ServerUser
    /** @type {import("./$types").RequestHandler} */
export async function GET({params}) {
    const user = await ServerUser.load({id: parseInt(params.user_id)});
    const followers = await user.loadFollowers();
    const serializedFollowers = followers.map(user => user.serializeForFrontend());
    const results = await Promise.all(serializedFollowers);

    return new Response(JSON.stringify(results));
}