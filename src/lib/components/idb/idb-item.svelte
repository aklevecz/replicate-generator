<script>
  import { browser } from "$app/environment";
  import modelStorage from "$lib/idb";
  import modelSvelte from "$lib/stores/model.svelte";
  import ThreeScene from "$lib/three";
  import { onDestroy, onMount } from "svelte";

  /** @type {{model: Omit<ModelEntry, "data">}}*/
  let { model, } = $props();

  /** @type {ThreeScene | null}*/
  let threeModel = $state(null);
  /** @type {null | HTMLElement}*/
  let container = $state(null);
  onMount(async () => {
    if (container && browser) {
      threeModel = new ThreeScene(container);
      threeModel.animate();
      const modelEntry = await modelStorage.getModel(model.id);
      if (!modelEntry) {
        console.error(`Model not found: ${model.id}`);
        return;
      }
      const blob = new Blob([modelEntry.data]);
      const blobUrl = URL.createObjectURL(blob);
      threeModel.loadModel(blobUrl);
    }
  });

  onDestroy(() => {
    if (threeModel && threeModel.renderer) {
      threeModel.renderer.dispose();
    }
  });

  function onDelete() {
    modelSvelte.delete(model.id);
  }
</script>
{#snippet itemLabel(/** @type {{label: string, id: string}}*/ props)}
<div style="position:relative;"><span class="label">{props.label}:</span>{props.id}</div>
{/snippet}
{#if !model}
  <div>Loading...</div>
{:else}
  <div class="item-container">
    <div class="item_id">
        {@render itemLabel({label: "id", id: model.id})}
    </div>
    <div class="item_name">{@render itemLabel({label: "name", id: model.name})}</div>
    <div class="item_threeview" bind:this={container}></div>
    <div class="item_buttons">
        <button class="item_deletebutton" onclick={onDelete}>Delete</button>
    </div>
  </div>
{/if}

<style>
  .item-container {
    display: grid;
    /* grid-gap: 2.5rem; */
    grid-template-areas: 
    "id name name threeview"
    "buttons buttons buttons threeview";  
    grid-template-rows: 50px 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;

  }

  .item-container > div {
      border: 1px solid white;
      padding: 1rem;
      box-sizing: border-box;
  }

  .label {
    position: absolute;
    top:-8px;
    left:0;
    font-size: .5rem;
  }

  .item_id {
    grid-area: id;
  }
  .item_name {
    grid-area: name;
  }
  div.item_threeview {
    padding: 0rem;
    grid-area: threeview;
  }
  .item_buttons {
    grid-area: buttons;
  }
  .item_deletebutton {
    grid-area: deletebutton;
  }

  .item_threeview{
    width: 200px;
    height: 200px;
    width: 100%;
    height: 100%;
  }
  button {
    width: 100px;
    height: 50px;
  }
  button:hover {
    background-color: red;
  }
</style>
