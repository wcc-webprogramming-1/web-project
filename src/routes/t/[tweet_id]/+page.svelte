<script lang="ts">
    import { base } from "$app/paths";
    import ReativityBar from "$lib/client/component/ReativityBar.svelte";
    import Header from "$lib/client/component/header.svelte";
    import TweetDate from "$lib/client/component/tweetDate.svelte";
    import TweetImages from "$lib/client/component/tweetImages.svelte";
    import UserBasicView from "$lib/client/component/userBasicView.svelte";
    import type * as Type from './$types'
    
    export let data: Type.PageData;
</script>

<Header title="Post" description="" back_path="{base}/"/>

<div class="tweet">
    <div class="userInfo">
        <div class="header">
            <div>
                <UserBasicView data={data.self}/>
            </div>
            <div class="right-hand-side">
                <!--TODO-->
                <pre>A</pre>
            </div>
        </div>
    </div>
    
    <div>
        {#if data.self.content !== ""}
        <div class="tweetContent">{data.self.content}</div>
        {/if}

        <!-- TODO -->
        {#if data.self.images.length !== 0}
        <TweetImages user_asset={data.self.images[0]}/>
        <h1>DO NOT SUPPORT 4 PICTURES YET, FIX IT</h1>
        {/if}

    </div>

    <div>
        <TweetDate data={data.self.creation_date}/>
    </div>
        
    <div role="separator" class="separatorLine"/>

    <ReativityBar comment_amount={data.self.getCommentCount()} retweet_amount={data.self.retweets}
    like_amount={data.self.likes} bookmark_amount={data.self.bookmarks} compress />
</div>

<style>
    .separatorLine{
        border-top-color: rgb(119, 124, 128);
        border-top-width: 1px;
        border-top-style: solid;
    }

    .tweet{
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .userInfo{
        margin: 0;
        border: 0;
        display: flex;
        gap: 10px;
    }

    /* .tweetInfo{
        margin: 0;
        border: 0;
        padding-top: 0;
    } */

    .tweetContent{
        color: white;
    }

    pre {
        color: white;
        margin: 0;
        border: 0;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        margin: 0;
        border: 0;
    }
</style>