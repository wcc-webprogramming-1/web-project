<script lang="ts">
    import { ClientAsset } from "$lib/client/objects/asset";
    import { encodeAssetId } from "$lib/util/assetId";

  let imageId: string | undefined = undefined;

  async function handleUpload(event: any) {
    let asset = await ClientAsset.create(event.target.files[0]);

    imageId = encodeAssetId(asset.id);
  }
</script>

<input type="file" on:change={handleUpload} />

<pre>Image Id: {imageId ?? "None"}</pre>