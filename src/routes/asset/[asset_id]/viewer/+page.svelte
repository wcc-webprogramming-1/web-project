<script lang="ts">
    import { encodeAssetId } from '$lib/util/assetId';
  import type * as Type from './$types'

  export let data: Type.PageData;
</script>

<code>{JSON.stringify(data, null, 2)}</code>

<img src="/asset/{encodeAssetId(data.self.id)}" alt="preview" />