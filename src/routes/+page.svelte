<script>
  import BasicGenerator from "$lib/components/generate/basic-generator.svelte";
  import History from "$lib/components/history.svelte";
  import ModelSelector from "$lib/components/model-selector.svelte";
  import configurations from "$lib/configurations";
  import history from "$lib/stores/history.svelte";
  import { onMount } from "svelte";

  let model = $state(configurations["aklevecz/bao-flux"].model);

  onMount(() => {
    history.init();
  });
</script>

<div class="container">
  <h2>Generator</h2>
  <!-- <h1>{model}</h1> -->
  <div style="margin-bottom:.5rem;">Select model</div>
  <ModelSelector bind:model />
  <BasicGenerator {model} />
</div>
<History />

<style>
  .container {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    max-width: 500px;
    /* min-height: 100vh; */
    /* width: 80%; */
    /* margin:auto; */
    padding: 1rem 1rem;
  }
</style>
