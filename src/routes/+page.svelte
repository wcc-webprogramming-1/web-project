
  <!-- temporary -->

<script lang="ts">
  import type * as Type from './$types'

  export let data: Type.PageServerData;
</script>

<center>
  <h1>Homepage</h1>
  <p>Temporary landing page used to fill space</p>
  <p>Database Loading Test: {JSON.stringify(data.demo)}</p>
</center>

<style>
  h1, p {
    color: var(--c-neutral-100);
  }
</style>