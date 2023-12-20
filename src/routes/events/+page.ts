import { ClientEvent } from '$lib/client/objects/event.js';
import { ClientUser } from '$lib/client/objects/user.js';

/** @type {import('./$types').PageClientLoad} */
export async function load({ data }) {
  return {
    events: data.events.map(e => ClientEvent.deserialize(e)),
  };
}