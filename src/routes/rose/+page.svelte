<script>
  import { browser } from "$app/environment";
  import ProgressBar from "$lib/progress-bar.svelte";
  import generate from "$lib/stores/generate.svelte";
  import {
    animate,
    init,
    onWindowResize,
    renderer,
    updateMaterialWithGenerated
  } from "$lib/api/three";
  import { onDestroy } from "svelte";
  import configurations from "$lib/configurations";

  let model = $state(configurations["aklevecz/bao-flux"].model);

  /** @type {null | HTMLElement}*/
  let container = $state(null);

  // Lifecycle hooks
  $effect(() => {
    if (container && browser) {
      init(container);
      animate();
    }
  });

  onDestroy(() => {
    if (renderer) {
      renderer.dispose();
    }
    browser && window.removeEventListener("resize", onWindowResize);
  });

  async function generatePattern() {
    generate.reset();
    try {
      let data = await generate.createGeneration("a beautiful oil painting by Georgia O'Keeffe", model);
      if (!data?.id) {
        throw new Error("id is missing");
      }
      generate.pollGeneration(data.id);
    } catch (/** @type {*} */ e) {
      alert(e.message);
    }
  }

  $effect(() => {
    if (generate.state.outputs[0]) {
      updateMaterialWithGenerated(generate.state.outputs[0]);
    }
  });

  let generatedImg = $derived(generate.state.outputs[0])
</script>
{#if generatedImg}<img class="generated-preview" src={generatedImg} alt="Generated" />{/if}
<div bind:this={container} class="fbx-viewer"></div>
<div class="controls">


    <!-- <label>Upload Texture:</label>
    <input type="file" accept="image/*" onchange={handleTextureUpload} /> -->

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
    width:100px;
    height: 100px;
  }
</style>
