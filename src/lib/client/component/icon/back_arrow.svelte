<script lang="ts">
  import type { Color } from "$lib/client/types/color";

  export let size: number;
  export let color: Color;
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}>
  <path fill="var(--c-{color})" d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
</svg>