<script lang="ts">
    import Bookmark from "./icon/bookmark.svelte";
    import Comment from "./icon/comment.svelte";
    import Like from "./icon/like.svelte";
    import Retweet from "./icon/retweet.svelte";

    export let comment_amount: number;
    export let retweet_amount: number;
    export let like_amount: number;
    export let bookmark_amount: number;
    export let compress: boolean;

    function compress_fn(num: number): String{
        return Intl
            .NumberFormat("en", { notation: "compact" })
            .format(num);
    }

    $: comment_amount_text = compress
        ? compress_fn(comment_amount)
        : comment_amount.toString();
    
    $: retweet_amount_text = compress
        ? compress_fn(retweet_amount)
        : retweet_amount.toString();

    $: like_amount_text = compress
        ? compress_fn(like_amount)
        : like_amount.toString();

    $: bookmark_amount_text = compress
        ? compress_fn(bookmark_amount)
        : bookmark_amount.toString();
</script>

<div class="bar">
    <div>
        <Comment size={20} color="gray-200"/>
        <pre class="number">{comment_amount_text}</pre>
    </div>

    <div>
        <Retweet size={20} color="gray-200"/>
        <pre class="number">{retweet_amount_text}</pre>
    </div>

    <div>
        <Like size={20} color="gray-200"/>
        <pre class="number">{like_amount_text}</pre>
    </div>

    <div>
        <Bookmark size={20} color="gray-200"/>
        <pre class="number">{bookmark_amount_text}</pre>
    </div>
</div>

<style>
    .bar {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
    }

    .number {
        color: white;
    }

    .bar > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0;
        margin: 0;
    }

    .bar > div > pre {
        margin: 0;
        padding-left: 10px;
    }

</style>