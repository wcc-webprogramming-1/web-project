import { base } from '$app/paths';
import { ServerSession } from '$lib/server/objects/session.js';
import { ServerUser } from '$lib/server/objects/user.js';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  login: async (event) => {
    const data = await event.request.formData()
    const handle = data.get("handle");
    const password = data.get("password");

    if (handle == null) {
      return new Response("Missing handle", { status: 400 });
    }

    if (password == null) {
      return new Response("Missing password", { status: 400 });
    }

    const user = await ServerUser.loadLossy({ handle: handle.toString() });
    const canLogin = await user?.validatePassword(password.toString());

    if (!canLogin) {
      return new Response("Incorrect login", { status: 401 });
    }

    const session = await ServerSession.create(user!, event.getClientAddress());

    event.cookies.set("session", session.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    const res = {
      user: await user!.serializeForFrontend(),
      token: session.id,
    };

    return res
  }
}