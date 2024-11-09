<script>
  /** @type {{handleOnChange: (event: Event) => void}} */
  let { handleOnChange } = $props();
</script>

<div class="file-upload-container">
  <input type="file" id="file-upload" class="file-upload-input" accept=".fbx" onchange={handleOnChange} />
  <label for="file-upload" class="file-upload-label"> Choose a file or drag it here </label>
  <div class="selected-file"></div>
</div>

<style>
  .file-upload-container {
    position: relative;
    width: 300px;
    margin: 20px auto;
  }

  .file-upload-input {
    position: absolute;
    left: -9999px;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .file-upload-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    background: none;
    border: 2px solid #d1d5db;
    cursor: pointer;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    font-size: 14px;
    color: white;
    transition: all 0.2s ease;
  }

  .file-upload-label:before {
    content: "";
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'%3E%3C/path%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .file-upload-label:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }

  .file-upload-label:active {
    transform: scale(0.98);
  }

  /* Optional: Add a selected file name display */
  .selected-file {
    margin-top: 8px;
    font-size: 12px;
    color: #6b7280;
    text-align: center;
  }

  /* Optional: Add focus styles for accessibility */
  .file-upload-input:focus + .file-upload-label {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }
</style>
