<script>
    import "../app.css";
    import "../animations.css";
    let {children} = $props()
</script>
<nav>
  <a href="/">home</a>
  <a href="/rose">rose</a>
  <a href="/login">login</a>
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
    padding-left:1rem;
  }
  a {
    color: var(--accent-color);
    text-decoration: none;
  }
</style>