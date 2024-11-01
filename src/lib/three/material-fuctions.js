import { currentTexture, materials, model } from "$lib/api/three";

// Add these functions to control texture tiling
export function setTextureRepeat(x, y) {
    if (currentTexture) {
      currentTexture.repeat.set(x, y);
      currentTexture.needsUpdate = true;
    }
  }
  
  // Add these functions to control texture offset
  export function setTextureOffset(x, y) {
    if (currentTexture) {
      currentTexture.offset.set(x, y);
      currentTexture.needsUpdate = true;
    }
  }
  
  export function setModelMaterial(object, material) {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }
  
  // Function to change material
  export function changeMaterial(materialName) {
    if (model && materials[materialName]) {
      console.log(materials[materialName]);
      setModelMaterial(model, materials[materialName]);
    }
  }
  
  // Function to change material color
  export function setMaterialColor(color) {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh && child.material.color) {
          child.material.color.set(color);
        }
      });
    }
  }
  
  // Function to change metalness (for MeshStandardMaterial)
  export function setMetalness(value) {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh && child.material.metalness !== undefined) {
          child.material.metalness = value;
        }
      });
    }
  }
  
  // Function to change roughness (for MeshStandardMaterial)
  export function setRoughness(value) {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh && child.material.roughness !== undefined) {
          child.material.roughness = value;
        }
      });
    }
  }