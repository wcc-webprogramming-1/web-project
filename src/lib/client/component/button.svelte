<script lang='ts'>
    export let contents: string;
</script>

<div>
    <button on:click>{contents}</button>
</div>


<style>
    button{
        height: 33px;
        width: 108px;
        border: 1px solid grey;
        border-radius: 25px;
        background:transparent;
        color:white;
        font-size:14px;
        font-weight:600;
    }
</style>