/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  return {
    session: await locals.session?.user.serializeForFrontend()
  };
}
