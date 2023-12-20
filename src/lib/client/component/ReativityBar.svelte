<script lang="ts">
    import Bookmark from "./icon/bookmark.svelte";
    import Comment from "./icon/comment.svelte";
    import Like from "./icon/like.svelte";
    import Retweet from "./icon/retweet.svelte";
    import CircularStealthButton from "./circularStealthButton.svelte";
    import type { ClientTweet } from "../objects/tweet";

    export let compress: boolean;
    export let tweet: ClientTweet;

    function compress_fn(num: number): String{
        return Intl
            .NumberFormat("en", { notation: "compact" })
            .format(num);
    }

    $: comment_amount_text = compress
        ? compress_fn(tweet.getCommentCount())
        : tweet.getCommentCount().toString();
    
    $: retweet_amount_text = compress
        ? compress_fn(tweet.retweets)
        : tweet.retweets.toString();

    $: like_amount_text = compress
        ? compress_fn(tweet.likes)
        : tweet.likes.toString();

    $: bookmark_amount_text = compress
        ? compress_fn(tweet.bookmarks)
        : tweet.bookmarks.toString();
</script>

<div class="bar">
    <div>
        <CircularStealthButton
            icon={Comment}
            size={30}
            icon_normal_color="white"
            button_hover_color="blue-950"
        />
        <pre class="number">{comment_amount_text}</pre>
    </div>

    <div>
        <CircularStealthButton
            icon={Retweet}
            size={30}
            icon_normal_color="white"
            button_hover_color="emerald-950"
        />
        <pre class="number">{retweet_amount_text}</pre>
    </div>

    <div>
        <CircularStealthButton
            icon={Like}
            size={30}
            icon_normal_color={tweet.is_liked_by_user ? "red-500" : "white"}
            button_hover_color="red-950"
            icon_hover_color={tweet.is_liked_by_user ? "red-500" : "white"}
            icon_active={tweet.is_liked_by_user}

            on:click={async () => {
                await tweet.toggleLike();

                tweet = tweet // force re-render
            }}
        />
        <pre class="number">{like_amount_text}</pre>
    </div>

    <div>
        <CircularStealthButton
            icon={Bookmark}
            size={30}
            icon_normal_color="white"
            button_hover_color="white"

            on:click={async () => {
                await tweet.toggleBookmark()
                
                tweet = tweet
            }}
        />
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