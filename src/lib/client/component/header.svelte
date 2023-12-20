<script lang="ts">
  import { scrollY } from "../stores/render";
  import CircularStealthButton from "./circularStealthButton.svelte";
  import BackArrow from "./icon/back_arrow.svelte";

  export let title: string;
  export let description: string;
</script>

<div class="wraptohide">
  <main style:box-shadow={$scrollY == 0 ? "none" : ""}>
    <CircularStealthButton
      icon={BackArrow}
      size={40}
      icon_normal_color="white"
      button_hover_color="white"
      on:click={() => history.back()}
    />
    <div class="text">
      <pre class="title">{title}</pre>
      <pre class="description">{description}</pre>
    </div>

    <div class="glow" style:opacity={$scrollY == 0 ? 0 : 1}></div>
  </main>
</div>

<div class="padding" style="height: 66px; width: 575px; flex-shrink: 0"></div>

<style>
  .wraptohide {
    width: 575px;
    overflow: hidden;
    height: 100px;
    position: fixed;
    z-index: 100;
  }

  .glow {
    transition: opacity 0.2s;
    position: absolute;
    top: 63px;
    width: 600px;
    height: 2px;
    left: 0;
    background-color: rgba(255, 255, 255, 0.1);
  }

  main {
    transition: box-shadow 0.2s;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    height: 66px;
    padding-left: 12px;
    background-color: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
    width: 563px;
    box-shadow: 0px 0px 30px 2px rgba(0, 0, 0, 1);
  }

  .text {
    margin-left: 12px;
  }

  .title {
    font-size: 22px;
    font-weight: 600;
    color: var(--c-white);
    margin: 0;
    line-height: 22px;
  }

  .description {
    font-size: 14px;
    font-weight: 400;
    color: var(--c-zinc-500);
    margin: 0;
  }
</style>