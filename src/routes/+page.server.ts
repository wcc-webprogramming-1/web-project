import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		demo: db.Database.query("SELECT * FROM demo WHERE id = ?", [ 1 ])
	};
}