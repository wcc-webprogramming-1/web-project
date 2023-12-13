<script lang="ts">
  import type { ClientUser } from "../objects/user";

  export let user: ClientUser;
</script>

<img
  src={user.profilePicture?.url}
  alt="User's icon"
>

<style>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
  }
</style>