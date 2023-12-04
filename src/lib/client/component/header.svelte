<script lang="ts">
    import { goto } from "$app/navigation";
  import CircularStealthButton from "./circularStealthButton.svelte";
  import BackArrow from "./icon/back_arrow.svelte";

  export let title: string;
  export let description: string;
  export let back_path: string;
</script>

<main>
  <CircularStealthButton
    icon={BackArrow}
    size={40}
    icon_normal_color="white"
    button_hover_color="white"
    on:click={() => goto(back_path)}
  />
  <div class="text">
    <pre class="title">{title}</pre>
    <pre class="description">{description}</pre>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    height: 66px;
    padding-left: 12px;
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
    color: var(--c-white);
    margin: 0;
  }
</style>