<script lang="ts">
  import { goto as gotoFn } from "$app/navigation";

  export let goto: string;
</script>

<button on:click={() => gotoFn(goto)}><slot /></button>