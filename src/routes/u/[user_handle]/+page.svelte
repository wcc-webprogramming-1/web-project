<script lang="ts">
  import Header from '$lib/client/component/header.svelte';
  import UserBanner from '$lib/client/component/userBanner.svelte';
  import UserIcon from '$lib/client/component/userIcon.svelte';
  import type * as Type from './$types'

  export let data: Type.PageData;
</script>

<Header title={data.self.username} description="This is where the post count will go" back_path="/" />

<div class="page">
  <div class="banner">
    <UserBanner />
    <div class="icon">
      <UserIcon />
    </div>
  </div>

  <div class="content">
    <h1>{data.self.username}</h1>
    <h2>@{data.self.handle}</h2>
    <p>{data.self.bio}</p>
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
  }

  .banner {
    display: flex;
    flex-direction: column;
    margin-bottom: -75px;
  }

  .icon {
    position: relative;
    bottom: 75px;
    left: 25px;
    width: 150px;
    height: 150px;
    outline: 4px solid black;
    border-radius: 999px;
  }

  .content {
    margin-left: 25px;
    margin-top: 25px;
  }

  .content > h1 {
    font-size: 32px;
    font-weight: 400;
    color: var(--c-white);
    margin: 0;
    line-height: 32px;
  }

  .content > h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--c-zinc-500);
    margin: 0;
  }

  .content > p {
    font-size: 18px;
    font-weight: 400;
    color: var(--c-white);
    margin-top: 24px;
  }
</style>