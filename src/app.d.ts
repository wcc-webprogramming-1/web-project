// See https://kit.svelte.dev/docs/types#app

import type { ClientDeserializableUser } from "$lib/client/objects/user";
import type { ServerSession } from "$lib/server/objects/session";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: ServerSession | undefined,
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
