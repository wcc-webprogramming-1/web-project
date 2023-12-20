<script lang="ts">
  import { Realtime } from "$lib/client/realtime";
  import { onMount } from "svelte";
  import type * as Types from "./$types"
  import type { ClientEvent } from "$lib/client/objects/event";
  import Event from "$lib/client/component/event.svelte";

  export let data: Types.PageData;

  let events = data.events.sort((a: ClientEvent, b: ClientEvent) => b.time.getTime() - a.time.getTime()) as ClientEvent[];

  onMount(() => {
    for (const event of events) {
      event.addRemovedListener(() => {
        events = events.filter(e => e.id != event.id);
      });
    }

    Realtime.addEventListener(event => {
      events = [event, ...events];

      event.addRemovedListener(() => {
        events = events.filter(e => e.id != event.id);
      });
    })
  });

  $: console.log(events);
</script>

<main>
  {#each events as event}
    <Event { event } />
  {/each}
</main>
