import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene components
let scene, camera, renderer, controls;
let model;
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
let currentTexture = null;
let testCube = null;

function setupScene(container) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
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

function loadModel() {
  const loader = new FBXLoader();
  loader.load(
    "/rose-3.fbx",
    (object) => {
      model = object;
      model.traverse((child) => {
        // if (child.isMesh && (child.name.includes("petal") || child.name.includes("leaf"))) {
          child.material = materials.standard.clone();
        // }
      });
      
      scene.add(object);
      adjustCameraToModel(object);
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
    (error) => console.error("Error loading FBX:", error)
  );
}

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
    model.traverse((child) => {
      if (child.isMesh && (child.name.includes("petal") || child.name.includes("leaf"))) {
        child.material = materials.standard.clone();
      }
    });
  }

  if (testCube) {
    testCube.material = materials.standard;
  }
}

function handleTextureUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => updateMaterialTexture(e.target.result);
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

// Initialize the scene
function init(container) {
  setupScene(container);
  addLights();
  createTestCube();
  loadModel();
  window.addEventListener("resize", onWindowResize, false);
}

// Exports
export {
  init,
  animate,
  handleTextureUpload,
  updateMaterialTexture as updateMaterialWithGenerated,
  scene,
  camera,
  renderer,
  controls,
  model,
  materials,
  onWindowResize
};