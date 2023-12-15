<script lang='ts'>
    export let contents: string;
</script>

<div>
    <button>{contents}</button>
</div>


<style>
    button{
        height: 33px;
        width: 108px;
        border: 1px solid grey;
        border-radius: 25px;
        background-color: black;
        color:white;
        font-size:14px;
        font-weight:600;
    }
</style>