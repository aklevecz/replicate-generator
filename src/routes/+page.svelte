<script>
  import LoadingSpinner from "$lib/loading-spinner.svelte";



  let fetching = $state(false);

  let text = $state("");

  /** @type {string[]} */
  let outputs = $state([]);

  /** @type {{cancel: string, get: string}}} */
  let urls = $state({ cancel: "", get: "" });

  /** @type {Status} */
  let status = $state("starting");

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
      pollGeneration(data.id);
    } catch (e) {
      alert("something bad happened :(");
    }
    // fetching = false;
  }

  /** @param {string} id */
  async function pollGeneration(id) {
    /** @type {*} */
    let interval = null
    let intervalMs = 1000;
    let maxTimeout = 60 * 1000 * 6;
    let intervalStart = Date.now();
    fetching = true;
    interval = setInterval(async () => {
      const res = await fetch(`/generate?id=${id}`);
      const data = await res.json();
      console.log(data)
      if (data.status === "succeeded") {
        fetching = false;
        status = "succeeded";
        outputs = data.output;
        clearInterval(interval);

      } else if (data.status === "failed") {
        fetching = false;
        status = "failed";
        clearInterval(interval);

      } else if (data.status === "canceled") {
        fetching = false;
        status = "canceled";
        clearInterval(interval);

      }
      let timeElapsed = Date.now() - intervalStart
      if (timeElapsed > maxTimeout) {
        fetching = false;
        status = "canceled";
        clearInterval(interval);
      }
    }, intervalMs);
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
