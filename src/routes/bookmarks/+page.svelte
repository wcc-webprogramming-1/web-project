<script lang="ts">
    import type * as Type from './$types'
    export let data: Type.PageData;
    import Header from '$lib/client/component/header.svelte';
    import { Session } from '$lib/client/stores/session';
    import Post from '$lib/client/component/post.svelte';
    
    let bookmarks: ClientTweet[] = data.self;
</script>

<Header title="Bookmarks" description ={$Session.user.handle}/>

<div class="bookmarks">
    {#each bookmarks as bookmark}
    <div class ="bookmarked">
        <a href="/t/{bookmark.id}" class="directTo"><Post comment={bookmark} tweet_image_count={0}/></a>
    </div>
    {/each}
</div>

<style>
    .bookmarked{
        margin:10px;
        border-bottom:1px solid var(--c-zinc-500);
    }
    .directTo{
        text-decoration: none;;
    }
</style>