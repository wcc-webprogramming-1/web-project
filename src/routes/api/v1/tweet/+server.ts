import { ServerSession } from '$lib/server/objects/session.js';
import { ServerTweet } from '$lib/server/objects/tweet';

/** @type {import('./$types').RequestHandler} */
export async function POST(event){
    const requestData = await event.request.json();
    const newComment = await ServerTweet.create({
        ...requestData,
        likes: 0,
        retweets: 0,
        bookmarks: 0,
        userId: (await ServerSession.load(event.cookies.get("session")!)).user.id
    });

    return new Response(JSON.stringify(await newComment.serializeForFrontend()));
} 