import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import modelStorage from "$lib/idb";

class ThreeScene {
  constructor(container) {
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 2000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = null;
    this.model = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.testCube = null;
    this.currentTexture = null;

    this.loadedModels = []

    this.materials = {
      standard: new THREE.MeshStandardMaterial({
        color: "green",
        metalness: 0.5,
        roughness: 0.5,
      }),
      phong: new THREE.MeshPhongMaterial({
        color: 0x808080,
        shininess: 100,
      }),
      basic: new THREE.MeshBasicMaterial({
        color: 0x808080,
      }),
      wireframe: new THREE.MeshBasicMaterial({
        color: 0x808080,
        wireframe: true,
      }),
      normal: new THREE.MeshNormalMaterial(),
      toon: new THREE.MeshToonMaterial({
        color: 0x808080,
      }),
    };

    this.textureLoader = new THREE.TextureLoader();

    this.handleModelUpload = this.handleModelUpload.bind(this);
    this.handleTextureUpload = this.handleTextureUpload.bind(this);
    this.loadModel = this.loadModel.bind(this);
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.init(container);
  }

  init(container) {
    this.setupScene(container);
    this.addLights();
    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  setupScene(container) {
    this.scene.background = new THREE.Color(0x000000);

    this.camera.position.set(100, 200, 300);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 100, 0);
    this.controls.update();
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
  }

  createTestCube() {
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this.testCube = new THREE.Mesh(geometry, material);
    this.testCube.position.set(-10, 20, 0);
    this.scene.add(this.testCube);
  }

  loadModel(modelUrl) {
    console.log(`Loading model: ${modelUrl}`);
    const loader = new FBXLoader();

    if (this.model) {
        console.log("remove model")
        this.removeModel()
    }

    loader.load(
      modelUrl,
      (object) => {
        this.model = object;
        this.model.traverse((child) => {
          child.material = this.materials.standard.clone();
        });

        this.scene.add(object);
        this.adjustCameraToModel(object);
        this.loadedModels.push(object);
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
      (error) => console.error("Error loading FBX:", error)
    );
  }

  removeModel() {
    if (this.model) {
      this.scene.remove(this.model);
      this.loadedModels = this.loadedModels.filter((m) => m !== this.model);
      this.model = null;
    }
  }

/*************  ✨ Codeium Command ⭐  *************/
  /**
   * @param {Event} event - An event fired when the user selects a new file in the file input.
   * @description
   * Handles a file upload event, saves the file to IndexedDB, and loads the model.
   * If the file is successfully uploaded and loaded, removes the existing model and adds the new one.
   */
/******  eb00a272-e180-49b4-a1f7-9d504becf578  *******/
  handleModelUpload(event) {
    const file = event.target.files[0];
    modelStorage.saveModel(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const blob = new Blob([e.target.result], { type: "application/octet-stream" });
          const blobUrl = URL.createObjectURL(blob);
          this.loadModel(blobUrl);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  adjustCameraToModel(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

    this.camera.position.set(center.x, center.y, center.z + cameraZ);
    this.camera.lookAt(center);
    this.controls.target.copy(center);
    this.controls.update();
  }

  updateMaterialTexture(textureUrl) {
    this.currentTexture = this.textureLoader.load(textureUrl);
    this.currentTexture.wrapS = THREE.RepeatWrapping;
    this.currentTexture.wrapT = THREE.RepeatWrapping;

    this.materials.standard = new THREE.MeshStandardMaterial({
      map: this.currentTexture,
      metalness: this.materials.standard.metalness,
      roughness: this.materials.standard.roughness,
    });

    if (this.model) {
      this.model.traverse((child) => {
        child.material = this.materials.standard.clone();
      });
    }

    if (this.testCube) {
      this.testCube.material = this.materials.standard;
    }
  }

  handleTextureUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.updateMaterialTexture(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.mixer) this.mixer.update(this.clock.getDelta());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  async loadModelById(modelId) {
    const modelObject = await modelStorage.getModel(modelId);
    if (!modelObject) {
      console.error(`Model not found: ${modelId}`);
      return;
    }
    const blob = new Blob([modelObject.data]);
    const blobUrl = URL.createObjectURL(blob);
    console.log(`blobUrl: ${blobUrl}`);
    this.loadModel(blobUrl);
  }

  dispose() {
    // Clean up resources
    this.renderer.dispose();
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (object.material.map) object.material.map.dispose();
        object.material.dispose();
      }
    });
    // Remove event listener
    window.removeEventListener("resize", () => this.onWindowResize(), false);
  }
}

export default ThreeScene;
