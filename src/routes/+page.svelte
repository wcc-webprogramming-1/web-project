
  <!-- temporary -->

<script lang="ts">
  import { sendRealtimeRequest } from '$lib/client/realtime/session';
  import { Session } from '$lib/client/stores/session';
  import { onMount } from 'svelte';
  import type * as Type from './$types'
  import { Realtime } from '$lib/client/realtime';

  export let data: Type.PageData;

  let events: string[] = [];

  Realtime.addEventListener(e => {
    console.log(e);

    events = [...events, e.subject.handle + "@" + e.time.toISOString()];
  })
</script>

<center>
  <h1>Homepage</h1>
  <p>Temporary landing page used to fill space</p>
  <p>Database Loading Test: {JSON.stringify(data.demo)}</p>
  <p>Logged In: {$Session.isLoggedIn}</p>
  {#if $Session.isLoggedIn}
    <p>Logged in as {JSON.stringify($Session.user.username)}</p>
  {:else}
    <p>Not logged in</p>
  {/if}

  <button on:click={() => {
    Realtime.readEvents();
  }}>"Read" events</button>

  <p>Realtime Events ({$Realtime.UnseenEventCount}):</p>
  <ul>
    {#each events as event}
      <li>{event}</li>
    {/each}
  </ul>
</center>

<style>
  h1, p {
    color: var(--c-neutral-100);
  }
</style>