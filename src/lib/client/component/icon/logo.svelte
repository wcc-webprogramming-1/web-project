<script lang="ts">
  import type { Color } from "$lib/client/types/color";

  export let color: Color;
  export let size: number;
</script>

<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -8.881784197001252e-16, -2.220446049250313e-16)">
    <path fill="var(--c-{color})" d="M 18.244 2.25 L 21.552 2.25 L 4.99 21.75 L 1.68 21.75 L 9.41 12.915 L 1.254 2.25 L 8.08 2.25 L 12.793 8.481 L 18.244 2.25 Z M 10.584 11.365 L 11.594 10.013 L 7.084 4.126 L 5.117 4.126 L 10.584 11.365 Z"/>
  </g>
</svg>