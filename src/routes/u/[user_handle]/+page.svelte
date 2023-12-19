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
    import Upload from '$lib/client/component/icon/upload.svelte';
    import type { AssetId } from '$lib/server/objects/asset';
    import { encodeAssetId } from '$lib/util/assetId';
    import { ClientAsset } from '$lib/client/objects/asset';
    import Hourglass from '$lib/client/component/icon/hourglass.svelte';
    import Edit from '$lib/client/component/icon/edit.svelte';
    import { deserialize, enhance } from '$app/forms';
  
  export let data: Type.PageData;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let user: ClientUser = data.self;

  $: is_self = $Session.isLoggedIn && $Session.user.id == user.id;

  let loading_banner_upload = false;
  let loading_icon_upload = false;
  let loading_edit = false;

  async function handleBannerUpload(event: any) {
    loading_banner_upload = true;
    new_banner_asset = await ClientAsset.create(event.target.files[0]);
    loading_banner_upload = false;
  }

  async function handleIconUpload(event: any) {
    loading_icon_upload = true;
    new_icon_asset = await ClientAsset.create(event.target.files[0]);
    loading_icon_upload = false;
  }

  let edit_modal_open = false;

  let new_banner_asset: ClientAsset | undefined = undefined;
  let new_icon_asset: ClientAsset | undefined = undefined;

  let edit_banner_element: HTMLElement;
  let edit_icon_element: HTMLElement;

  function asAny(t: any): any {
    return t;
  }
</script>

{#key user}
<div class="editmodalwrap" class:open={edit_modal_open}>
  <form class="editmodal" method="POST" action="?/edit" use:enhance={() => {
    loading_edit = true;

    return (result) => {
      loading_edit = false;
      edit_modal_open = false;
      user = ClientUser.deserialize(asAny(result.result).data);

      console.log(result.result, user);
    }
  }}>
    <h1>Edit User</h1>

    <div class="assets">
      <button class="editbanner" on:click={(e) => {edit_banner_element.click(); e.preventDefault()}}>
        <UserBanner asset={new_banner_asset ?? user.bannerPicture} />
        <div class="overlay">
          <div class="ov-icon">
            {#if loading_banner_upload}
              <Hourglass size={50} color="white" />
            {:else}
              <Upload size={50} color="white" />
            {/if}
          </div>
        </div>
      </button>
      <input style="display: none" bind:this={edit_banner_element} type="file" form="none" accept="image/*" on:change={handleBannerUpload}>
      <input type="hidden" name="banner" value={new_banner_asset ? encodeAssetId(new_banner_asset.id) : user.bannerPicture ? encodeAssetId(user.bannerPicture.id) : undefined}>
      
      <button class="editicon" on:click={(e) => {edit_icon_element.click(); e.preventDefault()}}>
        <UserIcon asset={new_icon_asset ?? user.profilePicture} />
        <div class="overlay">
          <div class="ov-icon">
            {#if loading_icon_upload}
              <Hourglass size={50} color="white" />
            {:else}
              <Upload size={50} color="white" />
            {/if}
          </div>
        </div>
      </button>
      <input style="display: none" bind:this={edit_icon_element} type="file" form="none" accept="image/*" on:change={handleIconUpload}>
      <input type="hidden" name="icon" value={new_icon_asset ? encodeAssetId(new_icon_asset.id) : user.profilePicture ? encodeAssetId(user.profilePicture.id) : undefined}>
    </div>
    
    <div class="usernameinput">
      <div class="labelwrap">
        <label for="username">Username</label>
      </div>
      <input name="username" type="text" placeholder={user.username} />
    </div>

    <div class="usernameinput">
      <div class="labelwrap">
        <label for="bio">Bio</label>
      </div>
      <textarea name="bio" placeholder={user.bio}></textarea>
    </div>
    
    <div class="submitwrap">
      <button type="submit" class:loading={loading_edit}>
        {#if loading_edit}
          <Hourglass size={24} color="white" />
        {:else}
          <Edit size={24} color="white" />
        {/if}
        Edit
      </button>
    </div>
  </form>
</div>

<Header title={user.username} description="This is where the post count will go" />

<div class="page">
  <div class="banner">
    <UserBanner asset={user.bannerPicture} />
    <div class="icon">
      <UserIcon asset={user.profilePicture} />
      <div class = "followbutton">
        <Button on:click={() => edit_modal_open = true} contents={is_self ? "Edit Profile" : "Follow"}/>
      </div>
    </div>
  </div>

  <div class="content">
    <h1>{user.username}</h1>
    <h2>@{user.handle}</h2>
    <p class="bio">{user.bio}</p>
    <p class="joindate"><CalendarIcon size={20} color="zinc-500"/>Joined {months[user.creationDate.getMonth()]} {user.creationDate.getFullYear()}</p>
    <p class="followsCount"><FollowsCount { user } /></p>
  </div>
</div>
{/key}

<style>
  .labelwrap {
    padding-bottom: 4px;
  }

  .submitwrap {
    display: flex;
    justify-content: center;
  }

  .submitwrap > .loading {
    border: 2px solid var(--c-gray-600);
    background-color: var(--c-gray-800);
  }

  .submitwrap > button {
    padding: 10px;
    border-radius: 5px;
    border: 2px solid var(--c-emerald-600);
    background-color: var(--c-emerald-800);
    color: white;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 16px
  }

  .usernameinput {
    display: flex;
    flex-direction: column;
  }

  .usernameinput label {
    position: relative;
    padding: 5px;
    padding-bottom: 4px;

    border-radius: 5px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .editmodal label {
    font-size: 14px;
    font-weight: 500;
    color: var(--c-white);
    margin: 0;
  }

  .editmodal input[type="text"] {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--c-white);
    background-color: var(--c-stone-800);
    color: white;
  }

  .editmodal textarea {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--c-white);
    background-color: var(--c-stone-800);
    color: white;
    resize: none;
    height: 100px;
  }

  .assets {
    display: block;
    flex-direction: column;
    height: 205px;
    overflow: hidden;
  }

  .editicon > .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 0 10px 5px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .editicon {
    top: -64px;
    left: 16px;
    width: 128px;
    height: 128px;
    border-radius: 9999px;
    border: 2px solid white;
    position: relative;
    overflow: hidden;
    padding: 0;
  }

  .editbanner > .overlay > .ov-icon {
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.4));

    padding: 0;
    border: 0;
    background-color: transparent;
  }

  .editbanner > .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 0 10px 5px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .editbanner {
    cursor: pointer;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    display: flex;
    border: 2px solid white;
  }

  .editmodal {
    width: 400px;
    height: auto;
    padding: 1em;
    background-color: var(--c-stone-800);
    border: 2px solid var(--c-stone-600);
    border-radius: 10px;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .editmodal h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--c-white);
    margin: 0;
    line-height: 32px;
  }

  .editmodalwrap.open {
    display: flex;
  }

  .editmodalwrap {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

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
    cursor: pointer;
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