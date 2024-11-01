<script>
  import configurations from "./configurations";

  let { model = $bindable() } = $props();

  let allModels = Object.keys(configurations);

  /** @param {*} event */
  function handleModelChange(event) {
    const selectedKey = event.target.value;
    model = configurations[selectedKey].model;
  }
</script>

<select class="model-select" onchange={handleModelChange}>
  {#each allModels as modelKey}
    <option value={modelKey} selected={model === configurations[modelKey].model}>
      {configurations[modelKey].model}
    </option>
  {/each}
</select>

<style>
  /* Base select styles */
  .model-select {
    /* Size and spacing */
    width: 80%;
    max-width: 500px;
    padding: 12px 16px;
    margin-bottom: 2rem;

    /* Font */
    font-size: 1rem;
    font-family: inherit;

    /* Colors */
    background: transparent;
    color: white;

    /* Border */
    border: 2px solid white;
    border-radius: 4px;

    /* Remove default select styling */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    /* Custom dropdown arrow */
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px auto;

    /* Cursor */
    cursor: pointer;

    /* Prevent text overflow */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  /* Hover state */
  .model-select:hover {
    border-color: #ccc;
    background-color: rgba(255, 255, 255, 0.05);
  }

  /* Focus state */
  .model-select:focus {
    outline: none;
    border-color: #fff;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  /* Style for options */
  .model-select option {
    background-color: #1a1a1a;
    color: white;
    padding: 12px;
  }

  /* Disabled state */
  .model-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* For Firefox */
  .model-select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 white;
  }

  /* For IE/Edge */
  .model-select::-ms-expand {
    display: none;
  }
</style>
