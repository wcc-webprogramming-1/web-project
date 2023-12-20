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
  import { authServiceWorker, deauthServiceWorker } from "$lib/client/realtime/session";
  import { Session } from "$lib/client/stores/session";
    import { onMount } from "svelte";
  import type * as Types from "./$types";
    import { crossfade, fade } from "svelte/transition";
    import { circInOut, expoInOut } from "svelte/easing";
    import LeftBarItem from "$lib/client/component/leftBarItem.svelte";
    import Home from "$lib/client/component/icon/home.svelte";
    import Bell from "$lib/client/component/icon/bell.svelte";
    import Bookmark from "$lib/client/component/icon/bookmark.svelte";
    import Profile from "$lib/client/component/icon/profile.svelte";
    import { scrollY } from "$lib/client/stores/render";
    import Logo from "$lib/client/component/icon/logo.svelte";

  const [cross_out, cross_in] = crossfade({ duration: 500 });

  export let data: Types.PageData;

  if (data.token) {
    authServiceWorker(data.token);
  }

  if (data.session !== undefined) {
    Session.set({
      isLoggedIn: true,
      user: ClientUser.deserialize(data.session)
    });
  } else {
    Session.set({
      isLoggedIn: false,
      user: undefined,
    })
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

    deauthServiceWorker();
    animating_login = false;

    fetch("/api/v1/logout")
      .catch(() => {
        if (user !== undefined) {
          Session.set({
            isLoggedIn: true,
            user: user
          });

          authServiceWorker(data.token);
        }
      })
  }
</script>

<div class="root">
  <div class="left-bar">
    <div class="logo" style="padding: 16px;">
      <Logo size={48} color="white" />
    </div>
    <LeftBarItem path="/" text="Home" icon={Home} />
    {#if $Session.isLoggedIn}
      <div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
        <LeftBarItem path="/bookmarks" text="Bookmarks" icon={Bookmark} />
      </div>
      <div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
        <LeftBarItem path="/events" text="Notifications" icon={Bell} />
      </div>
      <div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
        <LeftBarItem path="/u/{$Session.user.handle}" text="Profile" icon={Profile} />
      </div>
    {/if}
  </div>

  <div class="center" on:wheel={(e) => $scrollY = e.currentTarget.scrollTop}>
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
            <UserDetail self={user} handle={$loginUserField} locked={!animating_login} {locked_open}>
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
  .user {
    margin: 8px;
  }

  .root {
    --border-color: var(--c-neutral-500);

    display: flex;
    flex-direction: row;
    align-items: stretch;
    min-height: 100vh;
    gap: 1px;
    background-color: var(--border-color);
  }

  .left-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-950);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .center {
    max-width: 33%;
    min-width: 575px;
    flex-grow: 1;
    background-color: var(--c-black);
    overflow-x: clip;
    display: flex;
    flex-direction: column;
  }

  :global(html)::-webkit-scrollbar {
    display: none;
  }

  .right-bar {
    width: 33%;
    flex-grow: 1;
    background-color: var(--c-neutral-950);
    position: sticky;
    top: 0;
    height: 100vh;
  }
</style>