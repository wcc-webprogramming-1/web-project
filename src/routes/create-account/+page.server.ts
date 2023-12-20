import { base } from '$app/paths';
import { ServerSession } from '$lib/server/objects/session.js';
import { ServerUser } from '$lib/server/objects/user.js';
import { decodeAssetId } from '$lib/util/assetId.js';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  create_account: async (event) => {
    const data = await event.request.formData()
    const username = data.get("username");
    const handle = data.get("handle");
    const password = data.get("password");
    const repeat_password = data.get("repeat_password");
    const icon_asset = data.get("icon_asset");
    const banner_asset = data.get("icon_asset");

    if (handle == null) return new Response("Missing handle", { status: 400 });
    if (password == null) return new Response("Missing password", { status: 400 });
    if (username == null) return new Response("Missing username", { status: 400 });
    if (repeat_password == null) return new Response("Missing repeat_password", { status: 400 });
    
    if (password != repeat_password) return new Response("Passwords do not match", { status: 400 });

    if (handle.toString().toLowerCase().split("").find((char) => !char.match(/[a-z0-9_-]/)))
      throw new Error("Handle contains invalid characters");

    const existingUser = await ServerUser.loadLossy({ handle: handle.toString().toLowerCase() });

    if (existingUser) 
      throw new Error("Handle already taken");

    console.log({ icon_asset, banner_asset })

    const user = await ServerUser.create({
      handle: handle.toString().toLowerCase(),
      password: password.toString(),
      username: username.toString(),
      bio: "",
      profile_asset_id: icon_asset && icon_asset.toString().length > 0 ? decodeAssetId(icon_asset.toString()) : undefined,
      banner_asset_id: banner_asset && banner_asset.toString().length > 0 ? decodeAssetId(banner_asset.toString()) : undefined
    });

    const session = await ServerSession.create(user!, event.getClientAddress());

    event.cookies.set("session", session.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return await user!.serializeForFrontend(session.user);
  }
}