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
    <div class ="bookmarked"><Post comment={bookmark} tweet_image_count={0}/></div>
    {/each}
</div>

<style>
    .bookmarked{
        margin:10px;
    }
</style>