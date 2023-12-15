<script lang="ts">
    export let following_count: number;
    export let followers_count: number;
</script>

<div>
    <a href="#"><span style="color:white">{following_count}</span> Following</a> 
    <a href="#"><span style="color:white">{followers_count}</span> Followers</a>
</div>

<style>
    span{
        font-weight:700;
    }
    div{
        display:flex;
        flex-direction: row;
        gap:12px;
    }
    a{
        text-decoration: none;
        color:gray;
    }
    a:hover{
        text-decoration:underline;
    }
    

</style>
