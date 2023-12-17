<script lang="ts">
  import type { ClientAsset } from "../objects/asset";

  export let user_asset: ClientAsset[];
  export let image_count: number;

  let images = user_asset.sort(() => Math.floor(Math.random() * 3) - 1);
</script>

<div class="image-wrapper">
  {#if image_count === 1}
    <img class="one-image"
    src={images[0].url}
    alt="Picure"
    >
  {:else}
  {#if image_count < 4}
    {#if image_count < 3}
      <div class="images-2">
        <img class="column-left"
          src={images[0].url}
          alt="Picure"
        >
        <img class="column-right"
          src={images[1].url}
          alt="Picure"
        >
      </div>
    {:else}
      <div class="images-3">
        <div class="column-single">
          <img class="single-picture"
          src={images[0].url}
          alt="Picure"
          >
        </div>
        <div class="column-split">
          <img class="row-1"
            src={images[1].url}
            alt="Picure"
          >
          <img class="row-2"
            src={images[2].url}
            alt="Picure"
          >
        </div>
      </div>
    {/if}
    {:else}
      <div class="images-4">
        <div class="row-1">
          <img class="column-1"
            src={images[0].url}
            alt="Picure"
          >
          <img class="column-2"
            src={images[1].url}
            alt="Picure"
          >
        </div>
        <div class="row-2">
          <img class="column-1"
            src={images[2].url}
            alt="Picure"
          >
          <img class="column-2"
            src={images[3].url}
            alt="Picure"
          >
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .image-wrapper {
    display: flex;
    justify-content: left;
    overflow:hidden;

    gap: 2px;
  }

  .one-image {
    width: fit-content;
    height: auto;
    object-fit: scale-down;
    border: solid;
    overflow:hidden;
    border-radius: 2%;
    
  }

  .images-2 {
    display: flex;
    border: solid;
    overflow:hidden;
    border-radius: 2%;

    gap: 2px;
  }

  .images-3 {
    display: flex;
    object-fit: scale-down;
    align-items: center;
    overflow:hidden;

    gap: 2px;
  }

  .column-single {
    display: flex;
    object-fit:scale-down;
    justify-content: right;
    height: 100%;
    width: 100%;
  }

  .column-split {
    display: flex;
    flex-direction: column;
    object-fit: scale-down;
    justify-content:flex-end;
    width: 25%;
  }

  .images-4 {
    display: flex;
    flex-direction: column;
    border: solid;
    overflow:hidden;
    border-radius: 2%;

    gap: 2px;
  }

  .row-1 {
    display: flex;
    flex-direction: row;

    gap: 2px;
  }

  .row-2 {
    display: flex;
    flex-direction: row;

    gap: 2px;
  }

  .column-1 {
    display: flex;
    width: 100%;
  }

  .column-2 {
    display: flex;
    width: 100%;
    height: auto;
  }

    
</style>