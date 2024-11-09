<script>
    import modelStorage from "$lib/idb";
    import auth from "$lib/stores/auth.svelte";
    import generateSvelte from "$lib/stores/generate.svelte";
    import modelSvelte from "$lib/stores/model.svelte";
    import { onMount } from "svelte";
    import "../animations.css";
    import "../app.css";
    let {children, data} = $props()

    onMount(() => {
      modelStorage.init().then(() => {
        modelSvelte.init()
        generateSvelte.init()
      })
      auth.init(data)
    })
    
</script>
<nav>
  <a href="/">home</a>
  <a href="/rose">rose</a>
  <a href="/login">login</a>
  <a href="/idb">idb</a>
  <div>{data.user.phoneNumber}</div>
</nav>
{@render children()}
<style>
  :global(html, body) {
    color: white;
    background-color: black;
    font-family: monospace;
  }
  :global(button) {
    padding: 0.5rem;
    font-size: 1rem;
    background: none;
    border: 2px solid white;
    color: white;
  }
  :global(input) {
    padding: 0.5rem;
    font-size: 1rem;
    background: none;
    border: 2px solid white;
    color: white;
  }
  nav {
    display: flex;
    gap: 1rem;
    padding-left:1rem;
  }
  a {
    color: var(--accent-color);
    text-decoration: none;
  }
</style>