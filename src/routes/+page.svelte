<script lang="ts">
  import { Session } from '$lib/client/stores/session';
  import type * as Type from './$types'
  import UserIcon from '$lib/client/component/userIcon.svelte';
  import Media from '$lib/client/component/icon/media.svelte';
  import { ClientTweet } from '$lib/client/objects/tweet';
  import Post from '$lib/client/component/post.svelte';
  import { scrollY } from '$lib/client/stores/render';
  import { base } from '$app/paths';
  
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
  <div class="tweetBoxWrap">
    <div class="tweetBox tweetBoxShadow">
      <div class="icon"><UserIcon asset={$Session.user.profilePicture}/></div>
      <textarea placeholder="What is happening?!" id="tweet" name="tweet" bind:value={content_post}/>
    </div>
  </div>
  
  <div class="tweetboxpadding"></div>

  <div class="attachments" style="padding-right: 20px; align-items: {$scrollY > 71 ? "center" : "flex-end"}">
    <button class="attach"><Media size={25} color = "blue-500" /></button>
    <button class="post" on:click={() => uploadTweet(content_post)}>Post</button>
  </div>

  <div class="sep"/>

  <div class="homeTweets">
    {#each tweets as tweet}
      <div class ="singleTweets">
        <a href="/t/{tweet.id}" class="directTo"><Post comment={tweet}/></a>
      </div>
    {/each}
  </div>
  {:else}
{/if}

<style>
  .tweetBoxShadow {
    box-shadow: 0px 0px 30px 2px rgba(0, 0, 0, 1);
  }

  .tweetBoxWrap {
    position: fixed;
    z-index: 100;
    width: 575px;
    overflow: hidden;
    height: 200px;
  }

  .tweetBoxWrap > .tweetBox {
    position: unset;
  }
  
  .tweetboxpadding {
    flex-shrink: 0;
    height: 113px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .homeTweets {
    padding-top: 4px;
  }

  .sep, .separatorFullLine {
        border-top-color: rgb(119, 124, 128);
        border-top-width: 1px;
        border-top-style: solid;
        margin: 0;
        padding: 0;
        width: calc(100% + 40px);
        position: relative;
        right: 20px;
    }
    
  .tweetBox{
    display: flex;
    position: fixed;
    width: 550px;
    flex-direction: row;
    gap: 15px;
    color: var(--c-zinc-500);
    padding-left: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 100;
    backdrop-filter: blur(10px);
    background-color: rgba(0,0,0,0.7);
  }

  .attachments{
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding-right: 10px;
    align-items: center;
    gap: 10px;

    z-index: 101;

    position: sticky;
    top: 26px;
    align-self: flex-end;

    padding-bottom: 20px;
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
  .singleTweets{
    padding: 10px;
    margin:0px;
    border-bottom:1px solid var(--c-zinc-500);
    padding-bottom:5px;;
    text-decoration:none;
  }
  .directTo{
    text-decoration: none;
  }
</style>