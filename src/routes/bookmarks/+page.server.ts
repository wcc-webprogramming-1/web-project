import { ServerSession } from '$lib/server/objects/session.js';
import { ServerTweet } from '$lib/server/objects/tweet.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    if ( event.cookies ){
        const session_id = (await ServerSession.load(event.cookies.get("session"))).user.id;
    }
	const bookmarks_array = await ServerTweet.loadBookmarks(session_id);
    const bookmarks_serialized = bookmarks_array.map(tweet => tweet.serializeForFrontend());
    const bookmarks_serialized_array = await Promise.all(bookmarks_serialized);

    return {
        self: bookmarks_serialized_array
    }
}