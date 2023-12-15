<script lang="ts">
  import LinkButton from "$lib/client/component/linkButton.svelte";
  import UserIcon from "$lib/client/component/userIcon.svelte";
  import { ClientUser } from "$lib/client/objects/user";
  import { authServiceWorker, deauthServiceWorker } from "$lib/client/realtime/session";
  import { Session } from "$lib/client/stores/session";
  import type * as Types from "./$types";

  export let data: Types.PageData;

  if (data.token) {
    authServiceWorker(data.token);
  }

  if (data.session !== undefined) {
    Session.set({
      isLoggedIn: true,
      user: ClientUser.deserialize(data.session)
    });
  }

  function logout(user?: ClientUser | undefined) {
    Session.set({
      isLoggedIn: false,
      user: undefined
    });

    deauthServiceWorker();

    fetch("/api/v1/logout")
      .catch(() => {
        if (user !== undefined) {
          Session.set({
            isLoggedIn: true,
            user: user
          });

          authServiceWorker(data.token);
        }
      })
  }
</script>

<div class="root">
  <div class="left-bar">

  </div>

  <div class="center">
    <slot></slot>
  </div>

  <div class="right-bar">
    <div class="login">
      {#if $Session.isLoggedIn}
        <p>Waiting on moritzio component :) </p>
        <p>User: {$Session.user.username}</p>
        <button on:click={() => logout($Session.user)}>Logout</button>
      {:else}
        <LinkButton goto="/login">Login</LinkButton>
      {/if}
    </div>
  </div>
</div>

<style>
  .root {
    --border-color: var(--c-neutral-500);

    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 100vh;
    gap: 1px;
    background-color: var(--border-color);
  }

  .left-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }

  .center {
    max-width: 33%;
    min-width: 575px;
    flex-grow: 1;
    background-color: var(--c-black);
    overflow: hidden;
  }

  .right-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }
</style>