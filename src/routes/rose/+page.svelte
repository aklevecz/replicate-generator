<script>
  import { browser } from "$app/environment";
  import { onWindowResize, updateMaterialWithGenerated } from "$lib/api/three";
  import ProgressBar from "$lib/components/progress-bar.svelte";
  import ThreeFileUpload from "$lib/components/three-file-upload.svelte";
  import ThreeModelSelector from "$lib/components/three-model-selector.svelte";
  import configurations from "$lib/configurations";
  import modelStorage from "$lib/idb";
  import generate from "$lib/stores/generate.svelte";
  import modelSvelte from "$lib/stores/model.svelte";
  import ThreeScene from "$lib/three";
  import { onDestroy, onMount } from "svelte";

  let model = $state(configurations["aklevecz/rds-15"].model);
  let selectedModel = $state("");

  /** @type {ThreeScene | null}*/
  let threeModel = $state(null);
  /** @type {null | HTMLElement}*/
  let container = $state(null);
  onMount(async () => {
    if (container && browser) {
      threeModel = new ThreeScene(container);
      threeModel.init(container);
      threeModel.animate();

      const models = await modelStorage.getRecentModels();

      if (!models.length) {
        console.error("No models found");
        return;
      }

      const modelEntry = await modelStorage.getModel(models[0].id);

      if (!modelEntry) {
        console.error(`Model not found: ${models[0].id}`);
        return;
      }
      selectedModel = modelEntry.id;

      const blob = new Blob([modelEntry.data]);
      const blobUrl = URL.createObjectURL(blob);

      threeModel.loadModel(blobUrl);
    }
  });

  onDestroy(() => {
    if (threeModel && threeModel.renderer) {
      threeModel.renderer.dispose();
    }
    browser && window.removeEventListener("resize", onWindowResize);
  });

  let startedGenerating = $state(false);
  async function generatePattern() {
    startedGenerating = true;
    generate.reset();
    try {
      let data = await generate.createGeneration("flower", model);
      if (!data?.id) {
        throw new Error("id is missing");
      }
      generate.pollGeneration(data.id);
    } catch (/** @type {*} */ e) {
      alert(e.message);
    }
  }

  /** @type {(event: Event) => void} */
  function handleOnChange(event) {
    threeModel?.handleModelUpload(event);

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

  /** @param {*} event */
  function handleModelChange(event) {
    const selectedKey = event.target.value;
    console.log(`selectedKey: ${selectedKey}`);
    selectedModel = selectedKey;
    modelStorage.getModel(selectedModel).then((modelEntry) => {
      if (!modelEntry) {
        console.error(`Model not found: ${selectedModel}`);
        return;
      }
      const blob = new Blob([modelEntry.data]);
      const blobUrl = URL.createObjectURL(blob);
      threeModel?.loadModel(blobUrl);
    });
  }

  // $effect(() => {
  //   if (selectedModel) {
  //     modelStorage.getModel(selectedModel).then((modelEntry) => {
  //       if (!modelEntry) {
  //         console.error(`Model not found: ${selectedModel}`);
  //         return;
  //       }
  //       const blob = new Blob([modelEntry.data]);
  //       const blobUrl = URL.createObjectURL(blob);
  //       threeModel?.loadModel(blobUrl);
  //     });
  //   }
  // });

  $effect(() => {
    if (generate.state.outputs[0]) {
      console.log(`generated: ${generate.state.outputs[0]}`);
      threeModel?.updateMaterialTexture(generate.state.outputs[0]);
      startedGenerating = false;
    }
  });

  let generatedImg = $derived(generate.state.outputs[0]);
</script>

<!-- <input type="file" accept=".fbx" onchange={handleModelUpload}> -->
<ThreeFileUpload {handleOnChange} />
<ThreeModelSelector {handleModelChange} {selectedModel}/>
{#if generatedImg}<img class="generated-preview" src={generatedImg} alt="Generated" />{/if}
<div bind:this={container} class="fbx-viewer"></div>
<div class="controls">
  <!-- <label>Upload Texture:</label>
    <input type="file" accept="image/*" onchange={handleTextureUpload} /> -->
  {#if startedGenerating && !generate.state.percentage}<div>Warming up...</div>{/if}
  <div style="font-size: 24px; font-family: monospace;">{generate.state.percentage}</div>
  <ProgressBar />
  <button disabled={generate.state.generating} onclick={generatePattern}
    >{generate.state.generating ? "Generating..." : "Generate Pattern"}</button
  >
</div>

<style>
  .fbx-viewer {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  .controls {
    position: fixed;
    bottom: 0px;
    right: 0px;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    box-sizing: border-box;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .generated-preview {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
  }
</style>
