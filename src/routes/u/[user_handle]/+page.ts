import { ClientUser } from '$lib/client/objects/user.js';

/** @type {import('./$types').PageClientLoad} */
export async function load({ data }) {
	return {
		self: ClientUser.deserialize(data.self),
	};
}