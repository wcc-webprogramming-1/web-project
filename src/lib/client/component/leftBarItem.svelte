<script lang="ts">
    import type { ComponentType, SvelteComponent } from "svelte";
  import Home from "./icon/home.svelte";
    import type { Color } from "../types/color";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
  export let path: string;
  export let icon: ComponentType<SvelteComponent<{ size: number, color: Color, active?: boolean }>>;
  export let text: string;
</script>

<a href="{base}{path}">
  <pre>{text}</pre>
  <svelte:component this={icon} size={24} color={"white"} active={$page.url.pathname.toLowerCase() === `${base}${path}`.toLowerCase()} />
</a>

<style>
  a {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    padding: 6px;
    margin: 6px;
    padding-right: 12px;
    padding-left: 12px;
    align-items: center;
    gap: 12px;
  }

  a:hover {
    background-color: var(--c-neutral-700);
    border-radius: 999px;
  }

  pre {
    margin: 0;
    padding: 0;
    font-size: 18px;
    color: white;
    font-weight: bold;
  }
</style>