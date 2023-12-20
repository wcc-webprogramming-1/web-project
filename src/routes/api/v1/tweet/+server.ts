import { EventType } from '$lib/client/objects/event.js';
import { ServerEvent } from '$lib/server/objects/event.js';
import { ServerSession } from '$lib/server/objects/session.js';
import { ServerTweet } from '$lib/server/objects/tweet';
import { ServerUser } from '$lib/server/objects/user';

/** @type {import('./$types').RequestHandler} */
export async function POST(event){
    const session = await ServerSession.load(event.cookies.get("session")!);

    const requestData = await event.request.json();
    
    const content = requestData.content;

    if (content == null) return new Response("Missing content", { status: 400 });
    if (content.length > 280) return new Response("Content too long", { status: 400 });
    if (content.length == 0) return new Response("Content empty", { status: 400 });

    let parentId = requestData.parentId;

    const newComment = await ServerTweet.create({
        ...requestData,
        likes: 0,
        retweets: 0,
        bookmarks: 0,
        userId: session.user.id
    });

    if (parentId != null){
        const parentTweet = await ServerTweet.loadLossy({ id: parentId });

        if (parentTweet == undefined) return new Response("Parent tweet not found", { status: 400 });

        if (parentTweet.userId != session.user.id)
            ServerEvent.create({
                type: EventType.Mention,
                actor: session.user.id,
                subject: parentTweet.userId,
                post: newComment.id,
            })
    }

    // search for mentions in content and create events for them
    const mentions = content.match(/@([a-z0-9_-]+)/g);

    if (mentions != null){
        for (const mention of mentions){
            const handle = mention.slice(1);

            const user = await ServerUser.loadLossy({ handle });

            if (user == undefined) continue;

            if (user.id != session.user.id)
                ServerEvent.create({
                    type: EventType.Mention,
                    actor: session.user.id,
                    subject: user.id,
                    post: newComment.id,
                })
        }
    }

    return new Response(JSON.stringify(await newComment.serializeForFrontend(session.user)));
} 