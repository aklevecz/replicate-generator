<script>
    import "../animations.css";
    let {children} = $props()
</script>
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
</style>