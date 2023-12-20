<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
    import { onMount } from "svelte";
  import { ClientEvent, EventType } from "../objects/event";
    import type { ClientTweet } from "../objects/tweet";
    import { Session } from "../stores/session";
  import Like from "./icon/like.svelte";
    import Profile from "./icon/profile.svelte";
  import Post from "./post.svelte";
  import UserIcon from "./userIcon.svelte";

  export let event: ClientEvent;

  let event_tweet_parent: ClientTweet | undefined = undefined;

  onMount(() => {
    event.post?.loadParent()?.then(parent => {
      event_tweet_parent = parent;
    })
  })

  function asAny(value: any): any {
    return value;
  }
</script>

{#if event.type == EventType.Mention}
  <div class="post">
    <div class="flavor">
      <Profile size={16} color="blue-600" />
      {#if event_tweet_parent !== undefined}
        {#if $Session.user !== undefined && event_tweet_parent.author.id == $Session.user.id}
          <span>Someone replied to your yeet</span>
        {:else}
          <span>You were mentioned in a yeet</span>
        {/if}  
      {:else}
        <span>...</span>
      {/if}
    </div>
    <Post comment={asAny(event.post)} />
  </div>
{:else}
  <main>
    {#if event.type == EventType.Like}
      <Like active size={32} color="red-600" />
    {/if}

    <div class="content">
      {#if event.type == EventType.Like}
        <button class="icon" on:click={() => goto(`${base}/u/${event.actor.handle}`)}>
          <UserIcon asset={event.actor.profilePicture} />
        </button>
      {/if}
      <span class="text">
        {#if event.type == EventType.Like}
          <a href="/u/{event.actor.handle}">{event.actor.username}</a> liked your yeet
        {/if}
      </span>
    </div>
  </main>
{/if}

<style>
  .flavor {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    color: var(--c-blue-500);
    font-size: 14px;
    margin-bottom: 10px;
  }

  .flavor > span {
    font-weight: bold;
  }

  .icon {
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0;
    border: 0;
    background-color: transparent;
  }

  main {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  main, .post {
    padding: 12px;
    border-bottom: 1px solid var(--c-stone-500);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .text {
    margin: 0;
    font-size: 14px;
    color: white;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
</style>