<script lang="ts">
    import { base } from "$app/paths";
    import ReativityBar from "$lib/client/component/reativityBar.svelte";
    import Header from "$lib/client/component/header.svelte";
    import TweetDate from "$lib/client/component/tweetDate.svelte";
    import UserBasicView from "$lib/client/component/userBasicView.svelte";
    import UserHover from "$lib/client/component/userDetail.svelte";
    import { fade } from "svelte/transition";
    import type * as Type from './$types'
    import MoreOptions from "$lib/client/component/icon/more_options.svelte";
    import CircularStealthButton from "$lib/client/component/circularStealthButton.svelte";
    import ImageFormating from "$lib/client/component/ImageFormating.svelte";
    import Post from "$lib/client/component/post.svelte";
    import UserIcon from "$lib/client/component/userIcon.svelte";
    import { ClientTweet } from "$lib/client/objects/tweet";
    export let data: Type.PageData;

    let comments = data.comments;

    async function insertComment(reply_content: string){
        let response = await fetch("/api/v1/tweet", {
            method: "POST",
            body: JSON.stringify({
                content: reply_content,
                parentId: data.self.id,
            })
        });

        let responseSerialized = await response.json();
        let responseDesirialized = ClientTweet.deserialize(responseSerialized);

        comments = [ responseDesirialized, ...comments ];
        comment_count++;
    }

    let tweet_image_count = data.self.images.length;
    let is_user_hovered = 0;
    let reply_content: string = "";
    let comment_count: number = data.self.getCommentCount();
</script>

<Header title="Post" description=""/>


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

    <ReativityBar tweet={data.self} compress />

    <div role="separator" class="separatorLine"/>

    
    <div class="wrapper">
        <div class="wrapperTextBox">
            <div class="icon-textBox">
                <div class="icon">
                    <UserIcon asset={data.self.author.profilePicture}/>
                </div>
                <input type="text" bind:value={reply_content} class="textBox" placeholder="Post your reply">
            </div>
            <div>
                <input type="submit" value="Reply" on:click={() => insertComment(reply_content)}>
            </div>
        </div>
    </div>

    <div role="separator" class="separatorFullLine"/>
    
     {#each comments as comment}
        <Post comment={comment} />
        <div role="separator" class="separatorFullLine"/>
     {/each}
    
</div>

<!--
    <div class="replyName">
        Replying to 
        <div class="authorHandle">
            @{data.self.author.handle}
        </div>
    </div>
-->

<style>
    input[type=submit]{
        background-color: var(--c-blue-500);
        border: 2px solid var(--c-blue-600);
        color: white;
        padding: 12px;
        padding-left: 24px;
        padding-right: 24px;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        margin: 4px 2px;
        font-weight: bold;
        min-height: 36px;
        border-bottom-left-radius: 9999px;
        border-bottom-right-radius: 9999px;
        border-top-left-radius: 9999px;
        border-top-right-radius: 9999px;
        
    }

    .icon-textBox {
        display: flex;
        flex-direction: row;
    }

    input[type=text] {
        background-color: var(--c-black-600);
        border: 0;
        outline: none;
        color: white;
        font-size: large;
    }

    input::placeholder {
        font-size: large;
        opacity: 0.5;
        color: var(--c-gray-300);
    }

    .replyName {
        display: flex;
        flex-direction: row;
        justify-content: left;
        padding-left: 60px;

        gap: 5px;
    }

    .textBox {
        width: max-content;
        height: max-content;
        padding: 12px 20px;
        box-sizing: border-box;
        border: 2px solid #ccc;
        border-radius: 4px;
    }
    

    .separatorFullLine {
        border-top-color: rgb(119, 124, 128);
        border-top-width: 1px;
        border-top-style: solid;
        margin: 0;
        padding: 0;
        width: calc(100% + 40px);
        position: relative;
        right: 20px;
    }

    .icon {
        width: 50px;
        height: 50px;
        outline: 4px solid black;
        border-radius: 999px;
    }

    .wrapperTextBox {
        display: flex;
        flex-direction: row;
        background: black;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        border: 0;

        gap: 10px;
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