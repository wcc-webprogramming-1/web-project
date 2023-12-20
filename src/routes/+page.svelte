<script lang="ts">
  import { Session } from '$lib/client/stores/session';
  import type * as Type from './$types'
  import UserIcon from '$lib/client/component/userIcon.svelte';
  import Media from '$lib/client/component/icon/media.svelte';
  import { ClientTweet } from '$lib/client/objects/tweet';
  import Post from '$lib/client/component/post.svelte';
    import Comment from '$lib/client/component/icon/comment.svelte';
  
  export let data: Type.PageData;

  let tweets: ClientTweet[] = data.self;
  
  async function uploadTweet(content_post: string){
    let response = await fetch("api/v1/tweet", {
      method: "POST",
      body: JSON.stringify({
        content: content_post
      })
    });
  
    let responseSerialized = await response.json();
    let responseDeserialized = ClientTweet.deserialize(responseSerialized);
    tweets.unshift(responseDeserialized);
    tweets = tweets;
    content_post = "";
  }

  let content_post: string = "";
</script>

{#if $Session.isLoggedIn}
  <div class="tweetBox">
    <div class = "tweet">
      <div class = "icon"><UserIcon user={$Session.user}/></div>
      <textarea placeholder="What is happening?!" id="tweet" name="tweet" bind:value={content_post}/>
    </div>
    <div class="attachments">
      <button class="attach"><Media size={25} color = "blue-500" /></button>
      <button class="post" on:click={() => uploadTweet(content_post)}>Post</button>
    </div>
  </div>

  <div class="sep" />

  <div class="homeTweets">
    {#each tweets as tweet}
      <Post comment={tweet} tweet_image_count={0}/>
    {/each}
  </div>
  {:else}
    <center><h1>Log in</h1></center>
{/if}

<style>
  .homeTweets {
    padding-top: 4px;
  }

  .sep {
    height: 1px;
    background-color: var(--c-zinc-500);
  }
    
  .tweetBox{
    display: flex;
    flex-direction: column;
    gap: 15px;
    color: var(--c-zinc-500);
    padding-left: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .tweet{
    display: flex;
    flex-direction: row;;
    gap: 10px;
  }

  .attachments{
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding-right: 10px;
    gap: 10px;
    align-items: center;
  }
  .attach{
    padding-top:5px;
    background-color: transparent;
    border-radius:70%;
    border:0;
  }
  .attach:hover{
    background-color: var(--c-zinc-900);
  }
  .post{
    height: 35px;
    width: 65px;
    border-radius: 25px;
    border: transparent;
    font-size: 14px;
    font-weight: 600;
    color: var(--c-white);
    background-color: var(--c-blue-500);
  }
  .post:hover{
    background-color: var(--c-blue-600);
  }
  .icon{
    padding-top: 10px;
    width: 45px;
    height: 45px;
  }
  textarea{
    font-family: 'Inter', sans-serif;
    flex-grow: 1;
    padding-top: 20px;
    font-size: 20px;
    background-color: transparent;
    border: 0;
    outline: 0;
    color: var(--c-white);
    resize: none;
    
  }
  .homeTweets{

  }
</style>