<script>
  import history from "../stores/history.svelte";

  let imgSizes = {
    small: 50,
    medium: 100,
    large: 500
  }

  /** @type {"small" | "medium" | "large"} */
  let previewImgSize = $state("small");  

  let dims = $derived(imgSizes[previewImgSize])

  let previewImgSrc = $state("")

  /** @param {string} src */
  function showPreview(src) {
    previewImgSrc = src
  }

  function removeErrorImg() {
    // @ts-ignore
    this.parentElement.remove()
  }
</script>

<h2 style="margin-top:2rem;">History</h2>
<div style="margin-bottom:1rem;">
  <button onclick={() => previewImgSize = "small"}>small</button>
  <button onclick={() => previewImgSize = "medium"}>medium</button>
  <button onclick={() => previewImgSize = "large"}>large</button>
</div>
<div class:hide={!previewImgSrc} class="preview">
    <img onclick={() => previewImgSrc = ""} src={previewImgSrc} alt="history preview" />
</div>
<div class="history-item-container">
  {#each history.state as item, index}
    <div class="history-item">
      <img onerror={removeErrorImg} onclick={() => showPreview(item)} src={item} alt="Generated" style="width:{dims}px;height:{dims}px;" />
    </div>
  {/each}
</div>

<style>
  .history-item-container {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
    gap: 1rem;
  }

  .preview {
    top:0%;
    left:0;
    position: fixed;
    width:100%;
    height:auto;
    /* background-color: red; */
  }

  .preview img {
    width: 100%;
    height: 100%;
  }

  .hide {
    display: none;
  }
</style>
