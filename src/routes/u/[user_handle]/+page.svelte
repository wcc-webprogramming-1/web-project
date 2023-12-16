<script lang="ts">
  import Header from '$lib/client/component/header.svelte';
  import UserBanner from '$lib/client/component/userBanner.svelte';
  import UserIcon from '$lib/client/component/userIcon.svelte';
  import { base } from "$app/paths";
  import Button from '$lib/client/component/button.svelte';
  import CalendarIcon from '$lib/client/component/icon/calendarIcon.svelte';
  import type * as Type from './$types'
  import { Session } from '$lib/client/stores/session';
  import FollowsCount from '$lib/client/component/followsCount.svelte';
    import { ClientUser } from '$lib/client/objects/user';

  export let data: Type.PageData;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  $: is_self = $Session.isLoggedIn && $Session.user.id == data.self.id;
</script>

<Header title={data.self.username} description="This is where the post count will go" back_path="{base}/" />

<div class="page">
  <div class="banner">
    <UserBanner />
    <div class="icon">
      <UserIcon user={data.self} />
      <div class = "followbutton"><Button contents={is_self ? "Edit Profile" : "Follow"}/></div>
    </div>
  </div>

  <div class="content">
    <h1>{data.self.username}</h1>
    <h2>@{data.self.handle}</h2>
    <p class="bio">{data.self.bio}</p>
    <p class = "joindate"><CalendarIcon size={20} color="zinc-500"/>Joined {months[data.self.creationDate.getMonth()]} {data.self.creationDate.getFullYear()}</p>
    <p class="followsCount"><FollowsCount
      user={data.self}
    /></p>
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
  
  .followbutton{
    display: flex;
    position: relative;
    left: 425px;
    bottom: 65px;
  }

  .content {
    margin-left: 25px;
    margin-top: 15px;
  }

  .content > h1 {
    font-size: 22px;
    font-weight: 700;
    color: var(--c-white);
    margin: 0;
    line-height: 32px;
  }

  .content > h2 {
    font-size: 14px;
    font-weight: 500;
    color: var(--c-zinc-500);
    margin: 0;
  }

  .bio {
    color: var(--c-white);
    font-size: 15px;
    font-weight: 400;
    margin-top: 12px;
  }

  .joindate {
    font-size: 15px;
    font-weight: 400;
    color: var(--c-zinc-500);
    margin-top: 15px;
    display: flex;
    gap: 3px;
  }
  .followsCount{
    font-size: 15px;
  }
</style>