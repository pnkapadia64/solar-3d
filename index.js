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

const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS);
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(-EARTH_MOON_DISTANCE, 0, 0);

// Earth
const textureEarth = textureLoader.load("/assets/earth.jpg");
textureEarth.colorSpace = THREE.SRGBColorSpace;

const earthMaterial = new THREE.MeshLambertMaterial({
  map: textureEarth,
});
earthMaterial.metalness = 0.4;

const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.set(-SUN_EARTH_DISTANCE, 0, 0);

earthMesh.add(moonMesh);
// scene.add(earthMesh);

// Sun
const sunMesh = getSun();
sunMesh.add(earthMesh);
scene.add(sunMesh);

// Light
const ambientLight = new THREE.AmbientLight("#222", 30);
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
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(dimension.width, dimension.height);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // For smoother interaction

// GUI
gui.add(rotations, "earth").name("earth");
gui.add(rotations, "earthAround").setValue(false).name("earth around");
gui.add(rotations, "sun").name("sun");

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Earth
  if (rotations.earth) {
    earthMesh.rotation.y = elapsedTime * Math.PI * 0.4;
  }
  if (rotations.earthAround) {
    earthMesh.position.y = Math.sin(elapsedTime / 6) * 4;
    earthMesh.position.x = Math.cos(elapsedTime / 6) * 4;
  }

  // Sun
  if (rotations.sun) {
    sunMesh.rotation.y = elapsedTime * Math.PI * 0.1;
  }

  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// todo: resize
