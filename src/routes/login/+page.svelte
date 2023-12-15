<script lang='ts'>
  import { error } from "@sveltejs/kit";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { ClientUser } from "$lib/client/objects/user";
  import { Session } from "$lib/client/stores/session";
  import { authServiceWorker } from "$lib/client/realtime/session";

  function asAny(value: any): any {
    return value;
  }
</script>

<div class="wrapper">
  <form method="POST" action="?/login" use:enhance={(e) => {
    return (event) => {
      if (event.result.type === "success") {
        const user = ClientUser.deserialize(asAny(event.result.data).user);

        Session.set({
          isLoggedIn: true,
          user: user
        });

        authServiceWorker(asAny(event.result.data).token);
        
        goto("/")
      }
    }
  }}>
    <input name="handle" type="text" placeholder="Handle" />
    <input name="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    width: 200px;
  }

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>