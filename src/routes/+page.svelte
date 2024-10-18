<script>
  import LoadingSpinner from "$lib/loading-spinner.svelte";



  let fetching = $state(false);

  let text = $state("");

  /** @type {string[]} */
  let outputs = $state([]);

  async function handleClick() {
    fetching = true;
    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text.toLocaleLowerCase().replaceAll("finn", "a white cat") }),
      });
      /** @type {ReplicateResponse} */
      const data = await res.json();
      console.log(data)
      outputs = data.output;
    } catch (e) {
      alert("something bad happened :(");
    }
    fetching = false;
  }
</script>

<div class="container">
  {#if fetching}<LoadingSpinner />{/if}
  <img class="generated-img" src={outputs[0]} alt="Generated" />
  <input type="text" bind:value={text} onkeydown={(e) => e.key === "Enter" && handleClick()} />
  <button disabled={fetching} onclick={handleClick}>{fetching ? "Loading..." : "Generate"}</button>
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
  input {
    padding: 0.5rem;
    font-size: 1rem;
    margin-bottom: 1em;
    width: 80%;
    max-width: 500px;
  }
  button {
    padding: 0.5rem;
    font-size: 1.5rem;
  }
  .generated-img {
    max-width: 100%;
  }
</style>
