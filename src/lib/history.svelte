<script>
  import history from "./stores/history.svelte";

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

<h2>History</h2>
<div class:hide={!previewImgSrc} class="preview">
    <img onclick={() => previewImgSrc = ""} src={previewImgSrc} alt="history preview" />
</div>
<div class="history-container">
  {#each history.state as item, index}
    <div class="history-item">
      <img onerror={removeErrorImg} onclick={() => showPreview(item)} src={item} alt="Generated" style="width:50px;height:50px;" />
    </div>
  {/each}
</div>

<style>
  .history-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .preview {
    position: absolute;
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
