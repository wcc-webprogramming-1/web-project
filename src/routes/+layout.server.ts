// HACK!!! DO NOT REMOVE!!!
import "$lib/server/socket/session";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  return {
    session: await locals.session?.user.serializeForFrontend(),
    token: locals.session?.id,
  };
}
