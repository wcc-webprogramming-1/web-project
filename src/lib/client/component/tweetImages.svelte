<script lang="ts">
    import type { ClientAsset } from "../objects/asset";

    export let user_asset: ClientAsset;
</script>

<img
  src={user_asset.url}
  alt="Picure"
>

<style>
  img {
    width: 100%;
    height: 100%;
  }
</style>