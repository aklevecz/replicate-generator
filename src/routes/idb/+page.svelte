<script>
  import IdbImgItem from "$lib/components/idb/idb-img-item.svelte";
  import IdbItem from "$lib/components/idb/idb-item.svelte";
  import modelStorage from "$lib/idb";
  import generateSvelte from "$lib/stores/generate.svelte";
  import modelSvelte from "$lib/stores/model.svelte";
  import { onMount } from "svelte";

  /** @typedef {"models" | "generatedImgs"} View*/
  /** @type {View} */
  let view = $state("models");

  onMount(() => {
    // @ts-ignore
    view = localStorage.getItem("view") || "models";
  })

  $effect(() => {
    localStorage.setItem("view", view);
  })

  /** @param {Event} event */
  function handleModelUpload(event) {
    const target = /** @type {HTMLInputElement} */ (event.target);
    const file = target.files && target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
    modelStorage.saveModel(file).then(() => {
      modelSvelte.refreshAllModels();
    });
  }
</script>

<h1>IDB</h1>
<div style="display:flex; gap: 1rem;">
  <button onclick={() => (view = "generatedImgs")}>View Generated Imgs</button>
  <button onclick={() => (view = "models")}>View Models</button>
</div>
{#if view === "models"}
<h2>Three Models</h2>
  <div class="file-upload-container">
    <div style="margin-bottom: .5rem;">Upload new model</div>
    <input type="file" id="file-upload" class="file-upload-input" accept=".fbx" onchange={handleModelUpload} />
  </div>
  {#each modelSvelte.state.models as model}
    <IdbItem {model} />
  {/each}
{/if}

{#if view === "generatedImgs"}
  <h2>Generated Imgs</h2>
  <div class="generated-img-container">
    {#each generateSvelte.state.cachedImgs as imgObject}
      <IdbImgItem {imgObject} />
    {/each}
  </div>
{/if}

<style>
  .file-upload-container {
    border: 1px solid white;
    padding: 1rem;
    margin-bottom: 1rem;
    width: 50%;
    max-width: 500px;
  }
  .generated-img-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
