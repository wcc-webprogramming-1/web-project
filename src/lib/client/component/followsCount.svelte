<script lang="ts">
    import { base } from "$app/paths";
    import type { ClientUser } from "../objects/user";
    
    export let user: ClientUser;
</script>

<div>
    <a href="{base}/u/{user.handle}/following"><span style="color:white">{user.followingCount}</span> Following</a> 
    <a href="{base}/u/{user.handle}/followers"><span style="color:white">{user.followerCount}</span> Followers</a>
</div>

<style>
    span{
        font-weight: 700;
    }
    div{
        display: flex;
        flex-direction: row;
        gap: 12px;
    }
    a{
        text-decoration: none;
        color: var(--c-zinc-500);
    }
    a:hover{
        text-decoration: underline;
    }
    
</style>
