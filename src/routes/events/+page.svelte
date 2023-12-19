<script lang="ts">
  import { Realtime } from "$lib/client/realtime";
  import { onMount } from "svelte";
  import type * as Types from "./$types"
  import type { ClientEvent } from "$lib/client/objects/event";

  export let data: Types.PageData;

  let events = data.events.sort((a: ClientEvent, b: ClientEvent) => b.time.getTime() - a.time.getTime()) as ClientEvent[];

  onMount(() => {
    Realtime.addEventListener(event => {
      events = [event, ...events];
    })
  });

  $: console.log(events);
</script>

<main>
  <ul>
    {#each events as event}
      <li>
        <a href="/events/{event.id}">{event.time.toLocaleString()} - {event.type}</a>
      </li>
    {/each}
  </ul>
</main>
