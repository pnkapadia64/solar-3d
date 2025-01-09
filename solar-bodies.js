import * as THREE from "three";

export const SUN_RADIUS = 1.5;
export const EARTH_RADIUS = 0.8;
export const MOON_RADIUS = 0.3;
export const SUN_EARTH_DISTANCE = 8;
export const EARTH_MOON_DISTANCE = 1.5;

const textureLoader = new THREE.TextureLoader();

export const getSun = () => {
  const textureSun = textureLoader.load("/assets/sun.jpg");
  textureSun.colorSpace = THREE.SRGBColorSpace;

  const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureSun,
  });
  sunMaterial.roughness = 0.4;

  const sunGeometry = new THREE.SphereGeometry(SUN_RADIUS);
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh.position.set(0, 0, -4);

  return sunMesh;
};