<script lang="ts">
  import { preloadData } from "$app/navigation";
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import type { ClientUser } from "../objects/user";
  import UserBanner from "./userBanner.svelte";
  import UserBasicView from "./userBasicView.svelte";
  import UserIcon from "./userIcon.svelte";
  import { fade } from "svelte/transition";

  export let self: ClientUser | undefined;
  export let handle: string | undefined = undefined;

  export let locked: boolean = false;
  export let locked_open: boolean = false;

  onMount(() => {
    if (self) {
      preloadData(`${base}/u/${self.handle}`);
    }
  })

  $: height = 50 + (self
    ? (22 * self.bio.split("\n").length) + 10
    : 102);
</script>

<main>
  <div class="banner">
    <UserBanner asset={self?.bannerPicture} />
    <div class="iconandaction">
      <div class="icon">
        <UserIcon asset={self?.profilePicture} {locked} {locked_open} />
      </div>
      <div class="parentprovider">
        <slot />
      </div>
    </div>
  </div>
  <div class="content" style="height: {height}px;">
    <div class="names">
      {#if self !== undefined}
        <a class="name" out:fade={{ duration: 100 }} in:fade={{ duration: 100 }} href="{base}/u/{self.handle}">{self.username}</a>
        <pre class="handle" out:fade={{ duration: 100 }} in:fade={{ duration: 100 }}>@{self.handle}</pre>
      {:else}
        <div class="none-name" out:fade={{ duration: 100 }} in:fade={{ duration: 100 }} />
        <div class="none-handlewrap">
          {#if handle == undefined || handle == ""}
            <pre class="none-handleat" out:fade={{ duration: 100, delay: 100 }} in:fade={{ duration: 100 }}>@</pre>
            <div class="none-handle" out:fade={{ duration: 100, delay: 100 }} in:fade={{ duration: 100 }} />
          {:else}
            <pre class="none-handleat" out:fade={{ duration: 100 }} in:fade={{ duration: 100 }}>@{handle}</pre>
          {/if}
        </div>
      {/if}
    </div>
    {#if self !== undefined}
      <pre class="bio">{self.bio}</pre>
    {:else}
      <div class="none-bios">
        <div class="none-bio" />
        <div class="none-bio" />
        <div class="none-bio" style="width: 22%" />
      </div>
    {/if}
  </div>
</main>

<style>
  .none-handlewrap {
    position: absolute;
    top: 27px;
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  .none-handleat {
    margin: 0;

    position: absolute;
    top: -2px;

    color: var(--c-stone-500);
  }

  .none-handle {
    position: absolute;
    left: 20px;
    width: 90px;
    height: 22px;
    background-color: var(--c-stone-800);
    border-radius: 4px;
  }

  .none-name {
    height: 22px;
    margin-top: 1px;
    margin-bottom: 1px;
    width: 160px;
    background-color: var(--c-stone-700);
    border-radius: 4px;
    position: absolute;
    top: 0;
  }

  .parentprovider {
    padding-top: 60px;
  }
  
  .banner {
    display: flex;
    flex-direction: column;
    gap: 0px;
    height: 161px;
    border-radius: 15px;
    overflow: hidden;
  }

  .iconandaction {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: -50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .icon {
    width: 100px;
    height: 100px;
    border: 5px solid black;
    border-radius: 999px;
    display: flex;
    flex-direction: row;
    background-color: black;
  }

  .bio {
    position: relative;
    top: 50px;

    margin: 0;

    color: var(--c-gray-300);
  }

  .none-bios {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    top: 50px;
  }

  .none-bio {
    width: 100%;
    height: 22px;
    background-color: var(--c-stone-700);
    border-radius: 4px;

  }

  .names {
    display: flex;
    flex-direction: column;
    gap: 0px;
    position: relative;
  }

  .name {
    margin: 0;
    color: white;
    text-decoration: none;
    position: absolute;
    top: 0;
    font-weight: 700;
  }

  .name:hover {
    text-decoration: underline;
  }

  .handle {
    position: absolute;
    top: 25px;
    margin: 0;
    color: var(--c-stone-500);
  }

  main {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: black;
    border: 2px solid var(--c-stone-800);
    border-radius: 14px;
    width: 300px;

    box-shadow: 0px -1px 30px 0px var(--c-stone-800);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    padding-top: 0;
  }
</style>