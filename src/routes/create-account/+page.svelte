<script lang='ts'>
  import { error } from "@sveltejs/kit";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { ClientUser } from "$lib/client/objects/user";
  import { Session } from "$lib/client/stores/session";
  import { loginPasswordField, loginUserField } from "$lib/client/stores/loginuserfield";
  import Logo from "$lib/client/component/icon/logo.svelte";
  import { base } from "$app/paths";
    import type { AssetId } from "$lib/server/objects/asset";
    import { encodeAssetId } from "$lib/util/assetId";
    import { ClientAsset } from "$lib/client/objects/asset";

  function asAny(value: any): any {
    return value;
  }

  let set_profile_asset_element: HTMLElement;
  let set_banner_asset_element: HTMLElement;

  let profile_asset_id: AssetId | undefined = undefined;
  let banner_asset_id: AssetId | undefined = undefined;

  async function handleProfileUpload(event: any) {
    let asset = await ClientAsset.create(event.target.files[0]);

    profile_asset_id = asset.id;
  }

  async function handleBannerUpload(event: any) {
    let asset = await ClientAsset.create(event.target.files[0]);

    banner_asset_id = asset.id;
  }
</script>

<div class="wrapper">
  <form method="POST" action="?/create_account" use:enhance={(e) => {
    return (event) => {
      if (event.result.type === "success") {
        const user = ClientUser.deserialize(asAny(event.result.data));

        Session.set({
          isLoggedIn: true,
          user: user
        });
        
        goto("/")
      }
    }
  }}>
    <div class="logo">
      <Logo size={96} color="white" />
      <h1>Create Account</h1>
    </div>
    <input name="username" type="text" placeholder="Username" />
    <input name="handle" type="text" placeholder="Handle" />
    <input name="password" type="password" placeholder="Password" />
    <input name="repeat_password" type="password" placeholder="Repeat Password" />
    <div class="linesep" />
    <div class="profile">
      {#if profile_asset_id !== undefined}
        <img src="/asset/{encodeAssetId(profile_asset_id)}" alt="Profile" />
      {:else}
        <img src="/blankUserIcon.png" alt="Profile" />
      {/if}

      <button type="button" on:click={() => set_profile_asset_element.click()}>Change</button>
      <input bind:this={set_profile_asset_element} form="none" type="file" accept="image/*" on:change={handleProfileUpload} />
      <input type="hidden" name="icon_asset" value={profile_asset_id ? encodeAssetId(profile_asset_id) : ""}>
    </div>
    <div class="linesep" />
    <div class="banner">
      {#if banner_asset_id !== undefined}
        <img src="/asset/{encodeAssetId(banner_asset_id)}" alt="Banner" />
      {:else}
        <div class="bannernone" />
      {/if}

      <button type="button" on:click={() => set_banner_asset_element.click()}>Change</button>
      <input bind:this={set_banner_asset_element} form="none" type="file" accept="image/*" on:change={handleBannerUpload} />
      <input type="hidden" name="banner_asset" value={banner_asset_id ? encodeAssetId(banner_asset_id) : ""}>
    </div>
    <div class="linesep" />
    <button type="submit">Create Account</button>
    <a href="{base}/login">or Login</a>
  </form>
</div>

<style>
  .linesep {
    width: 330px;
    height: 1px;
    background-color: var(--c-stone-600);
  }

  .profile button {
    width: 130px;
  }

  .profile input {
    display: none;
  }

  .profile {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .profile img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 100%;
    background: radial-gradient(white 70%, black 0%);
    box-shadow: 0 0 40px -5px var(--c-stone-600);
  }

  .banner button {
    width: 130px;
  }

  .banner input {
    display: none;
  }

  .banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .bannernone {
    width: 300px;
    height: 100px;
    background-color: var(--c-stone-700);
    border-radius: 8px;
    box-shadow: 0 0 40px -5px var(--c-stone-600);
  }

  .banner img {
    width: 300px;
    height: 100px;
    object-fit: cover;
    background: var(--c-stone-600);
    border-radius: 8px;
    box-shadow: 0 0 40px -5px var(--c-stone-600);
  }

  form input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--c-stone-600);
    background-color: var(--c-stone-800);
    color: white;
    width: 280px;
  }

  form a {
    color: white;
    text-decoration: none;
    font-size: 0.8em;
    margin-top: 10px;
    transition: 0.2s;

    &:hover {
      color: var(--c-stone-400);
      text-decoration: underline;
    }
  }

  form button {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--c-stone-600);
    background-color: var(--c-stone-800);
    color: white;
    width: 300px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    width: 400px;
  }

  form .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  form h1 {
    margin: 0;
    color: white;
  }

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>