<script context="module" lang="ts">
    export type Variant = "primary" | "caution" | "significant";
</script>

<script lang='ts'>
    export let contents: string;

    export let variant: Variant = "primary";
</script>

<div>
    <button on:click class="variant-{variant}">{contents}</button>
</div>


<style>
    button {
        height: 35px;
        width: 108px;
        border-radius: 25px;
        font-size:14px;
        font-weight:600;
    }

    button.variant-primary {
        border: 1px solid var(--c-gray-400);
        color: var(--c-white);
        background: transparent;
    }

    button.variant-caution {
        border: 1px solid var(--c-red-700);
        color: var(--c-red-200);
        background: var(--c-red-950);
    }

    button.variant-significant {
        border: 1px solid var(--c-blue-700);
        color: var(--c-blue-200);
        background: var(--c-blue-950);
    }
</style>