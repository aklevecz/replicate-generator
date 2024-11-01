  <!-- <select onchange={(e) => changeMaterial(e.target.value)}>
    <option value="standard">Standard</option>
    <option value="phong">Phong</option>
    <option value="basic">Basic</option>
    <option value="wireframe">Wireframe</option>
    <option value="normal">Normal</option>
    <option value="toon">Toon</option>
  </select>

  <input type="color" onchange={(e) => setMaterialColor(e.target.value)} value="#808080" /> -->

<div class="slider-container">
  <label>Texture Repeat X:</label>
  <input
    type="range"
    min="0.1"
    max="5"
    step="0.1"
    value="1"
    oninput={(e) => setTextureRepeat(parseFloat(e.target.value), currentTexture?.repeat.y || 1)}
  />
</div>

<div class="slider-container">
  <label>Texture Repeat Y:</label>
  <input
    type="range"
    min="0.1"
    max="5"
    step="0.1"
    value="1"
    oninput={(e) => setTextureRepeat(currentTexture?.repeat.x || 1, parseFloat(e.target.value))}
  />
</div>

<div class="slider-container">
  <label>Texture Offset X:</label>
  <input
    type="range"
    min="-1"
    max="1"
    step="0.1"
    value="0"
    oninput={(e) => setTextureOffset(parseFloat(e.target.value), currentTexture?.offset.y || 0)}
  />
</div>

<div class="slider-container">
  <label>Texture Offset Y:</label>
  <input
    type="range"
    min="-1"
    max="1"
    step="0.1"
    value="0"
    oninput={(e) => setTextureOffset(currentTexture?.offset.x || 0, parseFloat(e.target.value))}
  />
</div>

<div class="slider-container">
  <label>Metalness:</label>
  <input
    type="range"
    min="0"
    max="1"
    step="0.1"
    value="0.5"
    onchange={(e) => setMetalness(parseFloat(e.target.value))}
  />
</div>

<div class="slider-container">
  <label>Roughness:</label>
  <input
    type="range"
    min="0"
    max="1"
    step="0.1"
    value="0.5"
    onchange={(e) => setRoughness(parseFloat(e.target.value))}
  />
</div>

<style>
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  select,
  input[type="color"] {
    padding: 5px;
    border-radius: 4px;
  }

  input[type="range"] {
    width: 100%;
  }

  label {
    color: white;
    font-size: 14px;
  }
</style>
