<script lang="ts">
  import type { ClientUser } from "../objects/user";

  export let user: ClientUser;
</script>

{#if user.profilePicture !== undefined}
  <img
    src={user.profilePicture.url}
    alt="User's icon"
  >
{:else}
  <img
    src="/blankUserIcon.png"
    alt="User has no icon"
  >
{/if}

<style>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
  }
</style>