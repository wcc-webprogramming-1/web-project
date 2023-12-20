import * as db from '$lib/server/database';
import { ServerAsset } from '$lib/server/objects/asset.js';
import { ServerSession } from '$lib/server/objects/session.js';
import { ServerTweet } from '$lib/server/objects/tweet.js';
import { ServerUser } from '$lib/server/objects/user.js';
import { decodeAssetId } from '$lib/util/assetId.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
	let user = await ServerUser.load({ handle: params.user_handle });
	let userTweets = await ServerTweet.loadSet({ userId: user.id });
	const session = await ServerSession.fromCookies(cookies);

	return {
		self: await user.serializeForFrontend(session?.user),
		tweets: await Promise.all(userTweets.map(tweet => tweet.serializeForFrontendComments(session?.user))),
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	edit: async (event) => {
		const form = await event.request.formData();

		const banner = form.get('banner');
		const icon = form.get('icon');
		const username = form.get('username');
		const handle = form.get('handle');
		const bio = form.get('bio');

		const session = await ServerSession.fromCookies(event.cookies);

		const user = await ServerUser.load({ handle: event.params.user_handle });

		if (session === undefined) {
			return { status: 403 };
		}

		if (user.id !== session.user.id) {
			return { status: 403 };
		}

		if (banner !== null) {
			await user.setBanner(await ServerAsset.load(decodeAssetId(banner.toString())));
		}

		if (icon !== null) {
			await user.setProfile(await ServerAsset.load(decodeAssetId(icon.toString())));
		}

		if (username !== null) {
			await user.setUsername(username.toString());
		}

		if (bio !== null) {
			await user.setBio(bio.toString());
		}

		return await user.serializeForFrontend(session.user);
	}
}