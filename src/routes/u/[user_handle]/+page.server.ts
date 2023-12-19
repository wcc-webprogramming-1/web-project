import * as db from '$lib/server/database';
import { ServerAsset } from '$lib/server/objects/asset.js';
import { ServerUser } from '$lib/server/objects/user.js';
import { decodeAssetId } from '$lib/util/assetId.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		self: await ServerUser.loadForClient({ handle: params.user_handle })
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

		const user = await ServerUser.load({ handle: event.params.user_handle });

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

		return await user.serializeForFrontend();
	}
}