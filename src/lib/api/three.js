import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import modelStorage from "$lib/idb";

/** @type {THREE.Scene} */
let scene;

/** @type {THREE.PerspectiveCamera} */
let camera;

/** @type {THREE.WebGLRenderer} */
let renderer;

/** @type {any} */
let controls;

/** @type {THREE.Group} */
let model;

/** @type {THREE.AnimationMixer} */
let mixer;
const clock = new THREE.Clock();

// Material definitions
const materials = {
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

// Texture handling
const textureLoader = new THREE.TextureLoader();

/** @type {THREE.Texture | null} */
export let currentTexture = null;

/** @type {THREE.Mesh | null} */
let testCube = null;

/** @param {HTMLElement} container */
function setupScene(container) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(100, 200, 300);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 100, 0);
  controls.update();
}

function addLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 0);

  scene.add(ambientLight);
  scene.add(directionalLight);
}

function createTestCube() {
  const geometry = new THREE.BoxGeometry(20, 20, 20);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  testCube = new THREE.Mesh(geometry, material);
  testCube.position.set(-10, 20, 0);
  scene.add(testCube);
}

/** @param {string} modelUrl */
function loadModel(modelUrl) {
  console.log(`Loading model: ${modelUrl}`);
  const loader = new FBXLoader();

  // If there's an existing model, remove it
  if (model) {
    scene.remove(model);
  }

  loader.load(
    modelUrl,
    (object) => {
      model = object;
      model.traverse((child) => {
        // @ts-ignore
        child.material = materials.standard.clone();
      });

      scene.add(object);
      adjustCameraToModel(object);
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
    (error) => console.error("Error loading FBX:", error)
  );
}

/** @param {*} event */
function handleModelUpload(event) {
  const file = event.target.files[0];
  modelStorage.saveModel(file);

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // Create a blob URL from the file data
        const blob = new Blob([e.target.result], { type: "application/octet-stream" });
        const blobUrl = URL.createObjectURL(blob);
        loadModel(blobUrl);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

/** @param {THREE.Object3D} object */
function adjustCameraToModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

  camera.position.set(center.x, center.y, center.z + cameraZ);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}
/** @param {string} textureUrl */
function updateMaterialTexture(textureUrl) {
  currentTexture = textureLoader.load(textureUrl);
  currentTexture.wrapS = THREE.RepeatWrapping;
  currentTexture.wrapT = THREE.RepeatWrapping;

  materials.standard = new THREE.MeshStandardMaterial({
    map: currentTexture,
    metalness: materials.standard.metalness,
    roughness: materials.standard.roughness,
  });

  if (model) {
    model.traverse((/** @type {*} */ child) => {
      // if (child.isMesh && (child.name.includes("petal") || child.name.includes("leaf"))) {
      child.material = materials.standard.clone();
      // }
    });
  }

  if (testCube) {
    testCube.material = materials.standard;
  }
}
/** @param {*} event*/
function handleTextureUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (/** @type {*} */ e) => updateMaterialTexture(e.target.result);
    reader.readAsDataURL(file);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  controls.update();
  renderer.render(scene, camera);
}

/** @param {HTMLElement} container */
async function init(container) {
  setupScene(container);
  addLights();
  createTestCube();
  const modelEntry = await modelStorage.getModel("model_1730671753408_d13035c2k");

  // Convert ArrayBuffer to Blob URL
  const blob = new Blob([modelEntry.data]);
  const blobUrl = URL.createObjectURL(blob);

  loadModel(blobUrl);
  // loadModel('rose-3.fbx');
  window.addEventListener("resize", onWindowResize, false);
}

/** @param {string} modelId */
async function loadModelByIdFromStorage(modelId) {
  const modelObject = await modelStorage.getModel(modelId);
  if (!modelObject) {
    console.error(`Model not found: ${modelId}`);
    return;
  }
  const blob = new Blob([modelObject.data]);
  const blobUrl = URL.createObjectURL(blob);
  console.log(`blobUrl: ${blobUrl}`);
  return blobUrl
}

// Exports
export {
  init,
  animate,
  handleTextureUpload,
  updateMaterialTexture as updateMaterialWithGenerated,
  handleModelUpload,
  scene,
  camera,
  renderer,
  controls,
  model,
  materials,
  onWindowResize,
  loadModelByIdFromStorage
};
