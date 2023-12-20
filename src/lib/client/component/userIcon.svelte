<script lang="ts">
  import { fade } from "svelte/transition";
  import type { ClientUser } from "../objects/user";
  import Lock from "./icon/lock.svelte";
    import type { ClientAsset } from "../objects/asset";

  export let asset: ClientAsset | undefined;

  export let locked: boolean = false;
  export let locked_open: boolean = false;
</script>

<div class="wrap" class:locked>
  {#if asset !== undefined}
    <img
      out:fade={{ duration: 100, delay: 100 }}
      in:fade={{ duration: 100 }}
      src={asset.url}
      alt="User's icon"
    >
  {:else}
    <img 
      out:fade={{ duration: 100, delay: 100 }}
      in:fade={{ duration: 100 }}
      src="/blankUserIcon.png"
      alt="User has no icon"
      class="blank"
    >
  {/if}

  {#if locked}
    <div class="lock" out:fade={{ duration: 450 }}>
      <Lock open={locked_open} size={32} color="white" />
    </div>
  {/if}
</div>

<style>
  .locked > img {
    filter: blur(1px) brightness(0.5);
  }
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(0) brightness(1);
    transition: filter 0.5s ease;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
    background: radial-gradient(white 70%, black 0%)
  }

  .lock {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 999px;
    overflow: hidden;
  }

  .wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>