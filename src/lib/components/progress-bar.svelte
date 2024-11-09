<script>
    import generate from "$lib/stores/generate.svelte";
</script>

<div class="progress-bar"><div style="width:{generate.state.percentage}%" class="progress-line"></div></div>

<style>
  .progress-bar {
    width: 100%;
    max-width: 500px;
    height: 20px;
    background: white;
    border-radius: 5px;
  }
  .progress-line {
    background-color: rgb(9, 255, 0);
    width: 0%;
    height: 100%;
    transition: width 0.5s ease-in;
  }
</style>
