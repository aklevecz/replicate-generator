<script>
  import modelStorage from "$lib/idb";
  import { onMount } from "svelte";

  /** @type {{imgObject: Omit<GeneratedImgEntry, "base64Url">}}*/
  let { imgObject } = $props();

  let imgEl = $state();

  onMount(async () => {
    let imgEntry = await modelStorage.getGeneratedImg(imgObject.id);
    imgEl.src = imgEntry.base64Url;
  });
</script>

<div class="generated-img-item">
  <img bind:this={imgEl} alt="Generated" />
  <div>{imgObject.prompt}</div>
</div>

<style>
  .generated-img-item {
    flex: 0 0 30%;
    word-break: break-all;
  }
  img {
    width: 300px;
    height: 300px;
  }
</style>
