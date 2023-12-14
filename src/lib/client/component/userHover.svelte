<script lang="ts">
  import { preloadData } from "$app/navigation";
  import { base } from "$app/paths";
  import type { ClientUser } from "../objects/user";
  import UserBanner from "./userBanner.svelte";
  import UserBasicView from "./userBasicView.svelte";
  import UserIcon from "./userIcon.svelte";

  export let self: ClientUser;

  preloadData(`${base}/u/${self.handle}`);
</script>

<main>
  <div class="banner">
    <UserBanner />
    <div class="icon">
      <UserIcon user={self}/>
    </div>
  </div>
  <div class="content">
    <div class="names">
      <a class="name" href="{base}/u/{self.handle}">{self.username}</a>
      <pre class="handle">@{self.handle}</pre>
    </div>
    <pre class="bio">{self.bio}</pre>
  </div>
</main>

<style>
  .banner {
    display: flex;
    flex-direction: column;
    gap: 0px;
    height: 150px;
    border-radius: 15px;
    overflow: hidden;
  }

  .icon {
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: 10px;
    border: 5px solid black;
    border-radius: 999px;
  }

  .bio {
    margin: 0;

    color: var(--c-gray-300);
  }

  .names {
    display: flex;
    flex-direction: column;
    gap: 0px;
  }

  .name {
    margin: 0;
    color: white;
    text-decoration: none;
  }

  .name:hover {
    text-decoration: underline;
  }

  .handle {
    margin: 0;
    color: var(--c-stone-500);
  }

  main {
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