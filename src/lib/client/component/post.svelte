<script lang="ts">
    import type { ClientTweet } from "../objects/tweet";
    import ImageFormating from "./ImageFormating.svelte";
    import ReativityBar from "./ReativityBar.svelte";
    import CircularStealthButton from "./circularStealthButton.svelte";
    import MoreOptions from "./icon/more_options.svelte";
    import UserIcon from "./userIcon.svelte";

    export let comment: ClientTweet;
    export let tweet_image_count: number;
</script>

<div>
    <div class="post">
        
        <div class="all-content">
            <div class="icon">
                <UserIcon user={comment.author}/>
            </div>
    
            <div class="align">
    
                <div class="first-line">
                    <div class="name-handle">
                        <pre class="name">{comment.author.username}</pre>
                        <pre class="handle">  @{comment.author.handle}</pre>
                    </div>
                </div>
                
                <div class="content">
                    {#if comment.content !== ""}
                        <div class="tweetContent">{comment.content}</div>
                    {/if}
                    
                    {#if tweet_image_count !== 0}
                    <ImageFormating user_asset={comment.images} image_count={tweet_image_count}/>
                    {/if}
                </div>
    
            </div>
        </div>

        <div class="more-options">
            <CircularStealthButton
            icon={MoreOptions}
            size={30}
            icon_normal_color="white"
            button_hover_color="white"
            />
        </div>

    </div>

    <ReativityBar comment_amount={comment.getCommentCount()} retweet_amount={comment.retweets}
                like_amount={comment.likes} bookmark_amount={comment.bookmarks} compress 
    />

    <div role="separator" class="separatorLine"/>

</div>

<style>
    .all-content {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .post{
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .name {
        color: white;
        padding: 0;
        margin: 0;
    }

    .name-handle {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .more-options {
        display: flex;
        justify-content: right;
    }

    .first-line {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .align {
        display: flex;
        flex-direction: column;
        
    }
    
    .handle {
        justify-content: left;
        color: var(--c-zinc-500);
        font-size: 12px;
        margin: 0;
    }

    .separatorLine {
        border-top-color: rgb(119, 124, 128);
        border-top-width: 1px;
        border-top-style: solid;
        margin: 0;
        padding: 0;
        width: calc(100% + 40px);
        position: relative;
        right: 20px;
    }

    .content {
        display: flex;
        flex-direction: column;
    }

    .icon {
        width: 50px;
        height: 50px;
        outline: 4px solid black;
        border-radius: 999px;
    }

    .content {
        color: white;
    }

</style>