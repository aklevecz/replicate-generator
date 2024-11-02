<script>
  import configurations from "$lib/configurations";
  import History from "$lib/history.svelte";
  import ModelSelector from "$lib/model-selector.svelte";
  import ProgressBar from "$lib/progress-bar.svelte";
  import generate from "$lib/stores/generate.svelte";
  import history from "$lib/stores/history.svelte";
  import { onMount } from "svelte";

  let text = $state("");
  let model = $state(configurations["aklevecz/bao-flux"].model);

  async function handleClick() {
    generate.reset();
    try {
      let data = await generate.createGeneration(text, model);
      if (!data?.id) {
        throw new Error("id is missing");
      }
      generate.pollGeneration(data.id);
    } catch (/** @type {*} */ e) {
      alert(e.message);
    }
  }

  let generatedImg = $derived(generate.state.outputs[0]);

  onMount(() => {
    history.init();
  });
</script>
<div class="container">
  <h2>Generator</h2>
  <!-- <h1>{model}</h1> -->
  <div style="margin-bottom:.5rem;">Select model</div>
  <ModelSelector bind:model />
  {#if generatedImg}
    <img class="generated_img" src={generatedImg} alt="Generated" />{/if}
  {#if !generatedImg}<img class="egg_img" class:pulse={generate.state.generating} src="/egg.svg" alt="egg" />{/if}
  {#if generate.state.generating}<div>
      {generate.state.percentage === 0 ? "starting..." : generate.state.percentage}
    </div>
    <div style="width:70%;margin-bottom:1rem;">
      <ProgressBar />
    </div>
  {/if}
  <textarea
    placeholder="Enter prompt here..."
    bind:value={text}
    onkeydown={(e) => e.key === "Enter" && handleClick()}
    disabled={generate.state.generating}>{text}</textarea
  >
  <button style="width:100px;" class:fade-pulse={generate.state.generating} disabled={generate.state.generating} onclick={handleClick}
    >{generate.state.generating ? "Generating..." : "Generate"}</button
  >
  <History />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    max-width: 500px;
    min-height: 100vh;
    /* width: 80%; */
    /* margin:auto; */
    padding:1rem 1rem;
  }

  textarea {
    padding: 0.5rem;
    font-size: 1rem;
    margin-bottom: 1em;
    width: 80%;
    height: 100px;
    max-width: 500px;
    background: none;
    border: 2px solid white;
    color: white;
  }

  .generated_img {
    max-width: 100%;
    max-width: 500px;
    margin-bottom: 1rem;
  }
  .egg_img {
    width: 100px;
    margin: 1rem auto 2rem;
  }
</style>
