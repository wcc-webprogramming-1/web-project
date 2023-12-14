<script lang="ts">
    import UserIcon from "$lib/client/component/userIcon.svelte";
    import type { ClientTweet } from "../objects/tweet";

    export let data: ClientTweet;
</script>

<div class="left-hand-side">
    <div class="icon">
        <UserIcon user={data.author}/>
    </div>
    <div class="names">
        <pre class="name">{data.author.username}</pre>
        <pre class="handle">@{data.author.handle}</pre>
    </div>
</div>

<style>

    .icon {
        width: 50px;
        height: 50px;
        outline: 4px solid black;
        border-radius: 999px;
    }

    .names{
        color: white;
    }

    .handle {
        font-size: 12px;
        margin: 0;
    }

    .name{
        margin: 0;
    }

    .left-hand-side {
        margin: 0;
        border: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    }
    
</style>