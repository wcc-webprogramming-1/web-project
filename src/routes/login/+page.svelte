<script lang='ts'>
  import { error } from "@sveltejs/kit";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { ClientUser } from "$lib/client/objects/user";
  import { Session } from "$lib/client/stores/session";
  import { loginPasswordField, loginUserField } from "$lib/client/stores/loginuserfield";
  import Logo from "$lib/client/component/icon/logo.svelte";
  import { base } from "$app/paths";

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
    <div class="logo">
      <Logo size={96} color="white" />
      <h1>Login</h1>
    </div>
    <input name="handle" bind:value={$loginUserField} type="text" placeholder="Handle" />
    <input name="password" bind:value={$loginPasswordField} type="password" placeholder="Password" />
    <button type="submit">Login</button>
    <a href="{base}/create-account">or Create an Account</a>
  </form>
</div>

<style>
  form input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--c-stone-600);
    background-color: var(--c-stone-800);
    color: white;
    width: 180px;
  }

  form a {
    color: white;
    text-decoration: none;
    font-size: 0.8em;
    margin-top: 10px;
    transition: 0.2s;

    &:hover {
      color: var(--c-stone-400);
      text-decoration: underline;
    }
  }

  form button {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--c-stone-600);
    background-color: var(--c-stone-800);
    color: white;
    width: 200px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    width: 200px;
  }

  form .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  form h1 {
    margin: 0;
    color: white;
  }

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>