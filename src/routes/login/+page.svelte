<script lang='ts'>
  import { error } from "@sveltejs/kit";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { ClientUser } from "$lib/client/objects/user";
    import { Session } from "$lib/client/stores/session";
    import { loginPasswordField, loginUserField } from "$lib/client/stores/loginuserfield";

  function asAny(value: any): any {
    return value;
  }
</script>

<div class="wrapper">
  <form method="POST" action="?/login" use:enhance={(e) => {
    return (event) => {
      if (event.result.type === "success") {
        const user = ClientUser.deserialize(asAny(event.result.data));

        Session.set({
          isLoggedIn: true,
          user: user
        });
        
        goto("/")
      }
    }
  }}>
    <input name="handle" bind:value={$loginUserField} type="text" placeholder="Handle" />
    <input name="password" bind:value={$loginPasswordField} type="password" placeholder="Password" />
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