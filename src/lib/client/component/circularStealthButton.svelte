<script lang="ts">
  import type { ComponentType, SvelteComponent } from "svelte";
  import type { Color } from "../types/color";

  export let icon: ComponentType<SvelteComponent<{
    size: number;
    color: Color;
    active?: boolean;
  }>>;

  export let size: number;
  export let icon_normal_color: Color;
  export let icon_hover_color: Color = icon_normal_color;
  export let button_hover_color: Color;

  export let icon_active: boolean = false;

  const SIZE_MULTIPLE = 2 / 3;

  let isHovered: boolean = false;
</script>

<div>
  <button 
    on:click
    on:mouseover={() => isHovered = true} 
    on:mouseout={() => isHovered = false}
    on:focus={() => isHovered = true}
    on:blur={() => isHovered = false}
    style:--size={size + "px"}
  >
    <div class="circle"
      style:background-color={`var(--c-${button_hover_color})`}
      style:--size={size + "px"}
      style:opacity={isHovered ? (button_hover_color === "white" ? 0.2 : 1) : 0}
    />
    <div class="icon" style:--offset={((size - (size * SIZE_MULTIPLE)) / 2) + "px"}>
      <svelte:component this={icon} active={icon_active} size={size * SIZE_MULTIPLE} color={isHovered ? icon_hover_color : icon_normal_color} />
    </div>
  </button>
</div>

<style>
  button {
    border: none;
    cursor: pointer;
    padding: 0;
    background-color: transparent;
    position: relative;
    width: var(--size);
    height: var(--size);
  }

  .circle {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 100000px;
    width: var(--size);
    height: var(--size);
    opacity: 0; /* needed to look good during load (otherwise it's visible for a few frames) */
    transition: opacity 0.2s ease-in-out;
  }

  .icon {
    position: absolute;
    top: var(--offset);
    left: var(--offset);
  }
</style>