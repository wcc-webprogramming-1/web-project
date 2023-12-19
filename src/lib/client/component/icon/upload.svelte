<script lang="ts">
    import type { Color } from "$lib/client/types/color";

  export let size: number;
  export let color: Color;
</script>

<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width={size} height={size} viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
  <path fill="var(--c-{color})" d="M446.313,208.813C447.031,203.25,448,197.75,448,192c0-70.688-57.281-128-128-128c-41.813,0-78.594,20.344-101.938,51.375  C209.656,113.344,201,112,192,112c-61.875,0-112,50.125-112,112c0,1.75,0.438,3.313,0.5,5.063C34.094,242.719,0,285.156,0,336  c0,61.875,50.125,112,112,112h272c70.719,0,128-57.281,128-128C512,272.063,485.344,230.75,446.313,208.813z M288,288v96h-64v-96  h-64l96-96l96,96H288z"/>
</svg>