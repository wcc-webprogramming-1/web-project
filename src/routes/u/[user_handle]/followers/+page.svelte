<script lang="ts">
    import BackArrow from "$lib/client/component/icon/back_arrow.svelte";
    import Header from "$lib/client/component/header.svelte";
    import type * as Type from './$types'
    import { base } from "$app/paths";
    import UserIcon from "$lib/client/component/userIcon.svelte";
    import { ClientUser } from "$lib/client/objects/user";
    import UserBioView from "$lib/client/component/userBioView.svelte";
    export let data: Type.PageData;
    import Button from "$lib/client/component/button.svelte";

    let fake_followers = [
        data.self,
        data.self,
        data.self,
        data.self
    ]

</script>

<Header title={data.self.username} description={data.self.handle} back_path="{base}/" />

<div class="followTabs">
    <a href="#" class="followers">Followers</a> 
    <a href="{base}/u/{data.self.handle}/following" class="following">Following</a>
</div>

<section>
    <div>
        {#each fake_followers as follower }
            <div class = "accountList">
                <UserBioView data = {follower}/>
                <span><Button contents = {"Follow"}/></span>
            </div>
        {/each}
    </div>
</section>


<style>
    .followTabs{
        display: flex;
        justify-content: space-around;
        flex-direction:row;
        padding-top: 5px;
        padding-left: 50px;
        padding-right: 50px;
        padding-bottom: 15px;
        border-bottom: solid 1px var(--c-zinc-500);
    }
    .followers{
        text-decoration: none;
        color: white;
        font-weight: 600;
    }
    .following{
        text-decoration: none;
        color: var(--c-zinc-500);
        font-weight: 600;
    }
    .followers:hover{
        text-decoration: underline;
    }
    .following:hover{
        text-decoration: underline;
    }
    .accountList{
        display:flex;
        justify-content:space-between;
        padding: 20px;
        padding-top:18px;
        padding-bottom: 6px;
    }
    .accountList:hover{
        background-color:var(--c-stone-800);
    }
</style>