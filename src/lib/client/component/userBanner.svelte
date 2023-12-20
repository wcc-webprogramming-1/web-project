<script lang="ts">
  import type { ClientAsset } from "../objects/asset";

  export let asset: ClientAsset | undefined;
</script>

<div class="wrap">
  {#if asset}
    <img src={asset.url} alt="User's banner" />
  {:else}
    <div class="nobanner" />
  {/if}
</div>

<style>
  .nobanner {
    width: 100%;
    height: 100%;
    background: var(--c-stone-700);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 3 / 1;
  }

  .wrap {
    aspect-ratio: 3 / 1;
    width: 100%;
    height: auto;
  }
</style>