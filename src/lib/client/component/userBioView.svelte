<script lang="ts">
    import UserIcon from "$lib/client/component/userIcon.svelte";
    import type { ClientUser } from "../objects/user";

    export let data: ClientUser;
</script>

<div class="left-hand-side">
    <div class="icon">
        <UserIcon asset={data.profilePicture}/>
    </div>
    <div class="names">
        <pre class="name">{data.username}</pre>
        <pre class="handle">@{data.handle}</pre>
        <pre class="bio">{data.bio}</pre>
    </div>
</div>

<style>

    .icon {
        padding-bottom:36px;
        width: 50px;
        height: 50px;
    }

    .names{
        color: white;
    }

    .handle {
        font-size: 12px;
        margin: 0;
        color: var(--c-zinc-500);
    }

    .name{
        margin: 0;
        font-weight: 700;
    }
    .bio{
        font-size: 13px;
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