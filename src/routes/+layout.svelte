<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
  import Button from "$lib/client/component/button.svelte";
  import LinkButton from "$lib/client/component/linkButton.svelte";
  import UserDetail from "$lib/client/component/userDetail.svelte";
  import UserIcon from "$lib/client/component/userIcon.svelte";
  import { ClientUser } from "$lib/client/objects/user";
    import { loginPasswordField, loginUserField } from "$lib/client/stores/loginuserfield";
  import { Session } from "$lib/client/stores/session";
    import { onMount } from "svelte";
  import type * as Types from "./$types";
    import { crossfade, fade } from "svelte/transition";
    import { circInOut, expoInOut } from "svelte/easing";

  const [cross_out, cross_in] = crossfade({ duration: 500 });

  export let data: Types.PageData;

  if (data.session !== undefined) {
    Session.set({
      isLoggedIn: true,
      user: ClientUser.deserialize(data.session)
    });
  }

  let user: ClientUser | undefined = undefined;
  let locked_open = false;
  $: username = $loginUserField;
  $: password = $loginPasswordField;

  onMount(() => {
    return loginPasswordField.subscribe(value => {
      if (username == undefined) {
        locked_open = false;
        return
      }
      
      if (value == undefined) {
        locked_open = false;
        return
      }

      if (value == "") {
        locked_open = false;
        return
      }

      if (user == undefined) {
        locked_open = false;
        return
      }

      user.validatePassword(value).then(valid => {
        locked_open = valid;
      }).catch(error => {
        locked_open = false;
      })
    })
  })

  onMount(() => {
    return loginUserField.subscribe(value => {
      if (value == undefined) {
        user = undefined;
        return
      }

      if (value == "") {
        user = undefined;
        return
      }

      ClientUser.loadFromHandleLossy(value).then(got => {
        console.log(value, got);

        user = got;
      }).catch(error => {
        user = undefined;
      })
    })
  })

  let animating_login = false;
  let old_is_logged_in: boolean | undefined = undefined;

  onMount(() => {
    return Session.subscribe(s => {
      console.log(s.isLoggedIn, old_is_logged_in);

      if (old_is_logged_in === undefined) {
        old_is_logged_in = s.isLoggedIn;
        return
      }

      if (old_is_logged_in == false && s.isLoggedIn == true) {
        animating_login = true;

        setTimeout(() => {
          if (animating_login)
            animating_login = false;
        }, 500)
      }

      old_is_logged_in = s.isLoggedIn;
    })
  })

  function logout(user?: ClientUser | undefined) {
    Session.set({
      isLoggedIn: false,
      user: undefined
    });

    animating_login = false;

    fetch("/api/v1/logout")
      .catch(() => {
        if (user !== undefined)
          Session.set({
            isLoggedIn: true,
            user: user
          });
      })
  }
</script>

<div class="root">
  <div class="left-bar">

  </div>

  <div class="center">
    <slot></slot>
  </div>

  <div class="right-bar">
    <div class="login">
      <div class="user">
        {#if $Session.isLoggedIn && !animating_login}
          <UserDetail self={$Session.user}>
            <Button variant="caution" contents="Logout" on:click={() => {
              logout($Session.user);
            }} />
          </UserDetail>
        {:else}
          {#if $page.url.pathname.endsWith("/login") || animating_login}
            <UserDetail self={user} locked={!animating_login} {locked_open}>
              {#if animating_login}
                <div in:fade={{ duration: 450, easing: circInOut }}>
                  <Button variant="caution" contents="Logout" on:click={() => {
                    logout($Session.user);
                  }} />
                </div>
              {/if}
            </UserDetail>
          {:else}
            <UserDetail self={undefined} handle={undefined}>
              {#if !$page.url.pathname.endsWith("/login")}
                <Button variant="significant" contents="Login" on:click={() => goto(`${base}/login`)} />
              {/if}
            </UserDetail>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .userinfowrapper {
    position: absolute;
    top: 8px;
  }

  .user {
    margin: 8px;
  }

  .root {
    --border-color: var(--c-neutral-500);

    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 100vh;
    gap: 1px;
    background-color: var(--border-color);
  }

  .left-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }

  .center {
    max-width: 33%;
    min-width: 575px;
    flex-grow: 1;
    background-color: var(--c-black);
    overflow: scroll;
  }

  .right-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-900);
  }
</style>