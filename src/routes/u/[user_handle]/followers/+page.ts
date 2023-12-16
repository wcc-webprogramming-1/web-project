import { ClientUser } from '$lib/client/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ data }) {
	return {
		self: ClientUser.deserialize(data.self),
        followers: data.followers.map(follower => ClientUser.deserialize(follower)),
	};
}