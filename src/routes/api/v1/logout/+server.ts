/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  event.cookies.delete('session');

  return new Response(JSON.stringify({}));
}
