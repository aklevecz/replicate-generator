<script>
  import configuration from "$lib/configuration";
  import generate from "$lib/stores/generate.svelte";
  import history from "$lib/stores/history.svelte";
  import { onMount } from "svelte";

  let text = $state("");
  /** @type {HTMLTextAreaElement | null}*/
  let textArea = $state(null);

  async function handleClick() {
    generate.reset();
    try {
      let data = await generate.createGeneration(text);
      if (!data?.id) {
        throw new Error("id is missing");
      }
      generate.pollGeneration(data.id);
    } catch (/** @type {*} */ e) {
      alert(e.message);
    }
  }

  onMount(() => {
    history.init()
  })
</script>

<div class="container">
  <h1>{configuration.model}</h1>
  {#if generate.state.outputs[0]}<img class="generated-img" src={generate.state.outputs[0]} alt="Generated" />{/if}
  {#if !generate.state.outputs[0]}<img
      class="egg"
      class:pulse={generate.state.generating}
      src="/egg.svg"
      alt="egg"
    />{/if}
  <textarea
    bind:this={textArea}
    bind:value={text}
    onkeydown={(e) => e.key === "Enter" && handleClick()}
    disabled={generate.state.generating}>{text}</textarea
  >
  <button class:fade-pulse={generate.state.generating} disabled={generate.state.generating} onclick={handleClick}
    >{generate.state.generating ? "Generating..." : "Generate"}</button
  >
  <h2>History</h2>
  <div>
    {#each history.state as item, index}
      <div class="history-item">
        <img src={item} alt="Generated" style="width:50px;height:50px;"/>
      </div>
    {/each}
  </div>
</div>

<style>
  :global(html, body) {
    color: white;
    background-color: black;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
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
  button {
    padding: 0.5rem;
    font-size: 1.5rem;
    background: none;
    border: 2px solid white;
    color: white;
  }
  .generated-img {
    max-width: 100%;
    max-width: 500px;
    margin-bottom: 1rem;
  }
  .egg {
    width: 100px;
    margin: 1rem;
    margin-bottom: 2.5rem;
  }
</style>
