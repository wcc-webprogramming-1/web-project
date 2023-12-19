<script lang="ts">
    import type { Color } from "$lib/client/types/color";
  
    export let color: Color;
    export let size: number;
  </script>
  
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -8.881784197001252e-16, -2.220446049250313e-16)">
      <path fill="var(--c-{color})" d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </g>
  </svg>