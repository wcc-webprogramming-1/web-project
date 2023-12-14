
  <!-- temporary -->

<script lang="ts">
  import { Session } from '$lib/client/stores/session';
  import type * as Type from './$types'

  export let data: Type.PageData;
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
</center>

<style>
  h1, p {
    color: var(--c-neutral-100);
  }
</style>