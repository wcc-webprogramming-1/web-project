import * as db from '$lib/server/database';
import { ServerUser } from '$lib/server/objects/user.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	// ServerUser.create({
	// 	bio: "Demo bio for user 0",
	// 	handle: "demo",
	// 	password: "demo",
	// 	username: "Demo User",
	// 	id: 0,
	// })

	return {
		demo: db.Database.query("SELECT * FROM demo WHERE id = ?", [ 1 ])
	};
}