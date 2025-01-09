import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  EARTH_MOON_DISTANCE,
  EARTH_RADIUS,
  getSun,
  MOON_RADIUS,
  SUN_EARTH_DISTANCE,
} from "./solar-bodies";

const rotations = {
  sun: true,
  earth: true,
  earthAround: true,
  moon: true,
  moonAround: true,
};

const canvas = document.getElementById("main");
const scene = new THREE.Scene();
const gui = new GUI();

const basicMaterial = new THREE.MeshLambertMaterial();
basicMaterial.roughness = 0.4;
basicMaterial.metalness = 0.2;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), basicMaterial);
sphere.position.set(SUN_EARTH_DISTANCE, 0, 0);
// scene.add(sphere);

const textureLoader = new THREE.TextureLoader();

// Moon
const textureMoon = textureLoader.load("/assets/moon.jpg");
textureMoon.colorSpace = THREE.SRGBColorSpace;

const moonMaterial = new THREE.MeshLambertMaterial({
  map: textureMoon,
});
moonMaterial.metalness = 0.4;

const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(MOON_RADIUS),
  moonMaterial
);
moonMesh.position.set(-EARTH_MOON_DISTANCE, 0, 0);
moonMesh.name = "moon";

// Earth
const textureEarth = textureLoader.load("/assets/earth.jpg");
textureEarth.colorSpace = THREE.SRGBColorSpace;
const earthMaterial = new THREE.MeshLambertMaterial({
  map: textureEarth,
});
earthMaterial.metalness = 0.4;

const earthCOG = new THREE.Group();
const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(EARTH_RADIUS),
  earthMaterial
);
earthMesh.name = "earth";

earthCOG.position.set(-SUN_EARTH_DISTANCE, 0, 0);
earthCOG.add(earthMesh);

earthCOG.add(moonMesh);

// Sun
const { sunMesh, sunCOG } = getSun();
sunCOG.add(earthCOG);
scene.add(sunCOG);

// Light
const ambientLight = new THREE.AmbientLight(0x404040, 30);
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(15).max(50).step(1).name("ambient");

const bulbLight = new THREE.PointLight("white", 15);
bulbLight.position.set(0, 0, -4);
bulbLight.castShadow = true;
scene.add(bulbLight);
gui.add(bulbLight, "intensity").min(10).max(30).step(1).name("bulb");

const dimension = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  75,
  dimension.width / dimension.height
);
camera.position.set(0, 0, 7);
camera.lookAt(new THREE.Vector3(0, 0, -4));
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(dimension.width, dimension.height);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Raycaster
const raycaster = new THREE.Raycaster();
const mousePos = new THREE.Vector2();
let clicked = false;
window.addEventListener("click", function (event) {
  mousePos.x = (event.clientX / dimension.width) * 2 - 1;
  mousePos.y = -(event.clientY / dimension.height) * 2 + 1;
  clicked = true;
});

// GUI
gui.add(rotations, "sun").setValue(false).name("sun");
gui.add(rotations, "earth").setValue(false).name("earth");
gui.add(rotations, "moon").setValue(false).name("moon");

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Sun
  if (rotations.sun) {
    sunMesh.rotation.y = elapsedTime * Math.PI * 0.05;
  }

  // Earth
  if (rotations.earth) {
    earthMesh.rotation.y = elapsedTime * Math.PI * 0.4;
    earthCOG.position.x = Math.cos(elapsedTime / 6) * SUN_EARTH_DISTANCE;
    earthCOG.position.y = Math.sin(elapsedTime / 6) * SUN_EARTH_DISTANCE;
  }

  // Moon
  if (rotations.moon) {
    moonMesh.rotation.y = elapsedTime * Math.PI * 0.6;
    moonMesh.position.y = Math.sin(elapsedTime / 3) * EARTH_MOON_DISTANCE;
    moonMesh.position.x = Math.cos(elapsedTime / 3) * EARTH_MOON_DISTANCE;
  }

  // raycaster
  raycaster.setFromCamera(mousePos, camera);
  const intersects = raycaster.intersectObjects([sunMesh, earthMesh, moonMesh]);

  if (clicked) {
    const objectClicked = intersects[0]?.object.name;
    if (objectClicked && rotations.hasOwnProperty(objectClicked)) {
      rotations[objectClicked] = !rotations[objectClicked];
    }
    clicked = false;
  }

  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// todo: resize
