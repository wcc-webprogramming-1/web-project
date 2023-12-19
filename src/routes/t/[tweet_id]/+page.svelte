<script lang="ts">
    import { base } from "$app/paths";
    import ReativityBar from "$lib/client/component/ReativityBar.svelte";
    import Header from "$lib/client/component/header.svelte";
    import TweetDate from "$lib/client/component/tweetDate.svelte";
    import UserBasicView from "$lib/client/component/userBasicView.svelte";
    import UserHover from "$lib/client/component/userHover.svelte";
    import { fade } from "svelte/transition";
    import type * as Type from './$types'
    import MoreOptions from "$lib/client/component/icon/more_options.svelte";
    import CircularStealthButton from "$lib/client/component/circularStealthButton.svelte";
    import ImageFormating from "$lib/client/component/ImageFormating.svelte";
    import Post from "$lib/client/component/post.svelte";
    import Comment from "$lib/client/component/icon/comment.svelte";
    import UserIcon from "$lib/client/component/userIcon.svelte";
    
    export let data: Type.PageData;

    let tweet_image_count = data.self.images.length;
    let is_user_hovered = 0;
</script>


<Header title="Post" description="" back_path="{base}/"/>


<div class="tweet">
    <div class="userInfo">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="header">
            {#if is_user_hovered > 0}
                <div class="userhover" in:fade={{ delay: 500, duration: 100 }} out:fade={{ duration: 100 }}>
                    <div class="userhovercontent" on:mouseenter={() => is_user_hovered++} on:mouseleave={() => is_user_hovered--}>
                        <UserHover self={data.self.author}/>
                    </div>
                </div>
            {/if}
            <div on:mouseenter={() => is_user_hovered++} on:mouseleave={() => setTimeout(() => is_user_hovered--, 10)}>
                <UserBasicView data={data.self.author}/>
            </div>
            <div class="right-hand-side">
                <CircularStealthButton
                    icon={MoreOptions}
                    size={30}
                    icon_normal_color="white"
                    button_hover_color="white"
                />
            </div>
        </div>
    </div>
    
    <div>
        {#if data.self.content !== ""}
        <div class="tweetContent">{data.self.content}</div>
        {/if}
    </div>
    <div>
        {#if tweet_image_count !== 0}
        <ImageFormating user_asset={data.self.images} image_count={tweet_image_count}/>
        {/if}
    </div>

    <div>
        <TweetDate data={data.self.creation_date}/>
    </div>
        
    <div role="separator" class="separatorLine"/>

    <ReativityBar comment_amount={data.self.getCommentCount()} retweet_amount={data.self.retweets}
    like_amount={data.self.likes} bookmark_amount={data.self.bookmarks} compress />

    <div role="separator" class="separatorLine"/>

    <!--
    <div class="wrapper">
        <div class="icon">
            <UserIcon user={data.self.author}/>
        </div>
        <div>
            <input type="text">
            <input type="submit">
        </div>
    </div>
     -->

    <Post comment={data.self} tweet_image_count={data.self.images.length} />
</div>

<style>
    .icon {
        width: 50px;
        height: 50px;
        outline: 4px solid black;
        border-radius: 999px;
    }

    .wrapper {
        display: flex;
        flex-direction: row;
        background: black;
    }

    .userhover {
        position: absolute;
        height: 0;
    }

    .userhovercontent {
        position: relative;
        top: 25px;
        left: 5px;
    }

    .separatorLine {
        border-top-color: rgb(119, 124, 128);
        border-top-width: 1px;
        border-top-style: solid;
    }

    .tweet {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .userInfo {
        margin: 0;
        border: 0;
        display: flex;
        gap: 10px;
    }

    .tweetContent {
        color: white;
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