<script lang="ts">
    import UserIcon from "$lib/client/component/userIcon.svelte";
    import type { ClientUser } from "../objects/user";

    export let data: ClientUser;
</script>

<div class="left-hand-side">
    <div class="icon">
        <UserIcon user={data}/>
    </div>
    <div class="names">
        <pre class="name">{data.username}</pre>
        <pre class="handle">@{data.handle}</pre>
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
        color: var(--c-zinc-500);
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
        align-items: self-start;
    }
    
</style>