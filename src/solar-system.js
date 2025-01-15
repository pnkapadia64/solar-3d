import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";
import GUI from "lil-gui";
import {
  EARTH_MOON_DISTANCE,
  EARTH_RADIUS,
  MOON_RADIUS,
  SUN_EARTH_DISTANCE,
  SUN_RADIUS,
} from "./constants.js";
import { CelestialBody } from "./celestial-body";
import { Renderer } from "./renderer";
import TickInstance from "./tick";
import RaycasterClickInstance from "./raycaster-click";
import { SUN_ROTATION_SPEED } from "./constants.js";
import { MOON_ROTATION_SPEED } from "./constants.js";
import { EARTH_ROTATION_SPEED } from "./constants.js";

const textureLoader = new THREE.TextureLoader();

class SolarSystem {
  constructor(canvas) {
    this.scene = new THREE.Scene();

    if (this.hasDebugMode()) {
      this.gui = new GUI();
    }
    this.setupCelestialBodies();
    this.setupSky();
    this.setupLight();

    const dimension = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.camera = new THREE.PerspectiveCamera(
      75,
      dimension.width / dimension.height
    );
    this.camera.position.set(0, 0, 7);
    this.camera.lookAt(new THREE.Vector3(0, 0, -4));
    this.scene.add(this.camera);

    this.renderer = new Renderer(canvas, this.camera, this.scene);

    TickInstance.startTick();
    RaycasterClickInstance.registerTick(this.camera);
  }

  setupCelestialBodies() {
    // Sun
    const sun = new CelestialBody(SUN_RADIUS, "./images/sun.jpg");
    sun.setName("sun");
    sun.setPosition(0, 0, -5);
    sun.setRotation(SUN_ROTATION_SPEED);
    sun.setupEvents();

    // Earth
    const earth = new CelestialBody(EARTH_RADIUS, "./images/earth.jpg");
    earth.setName("earth");
    earth.setPosition(-SUN_EARTH_DISTANCE, 0, 0);
    earth.setRotation(EARTH_ROTATION_SPEED);
    earth.setRevolution(SUN_EARTH_DISTANCE, 1 / 6);
    earth.setupEvents();

    // Moon
    const moon = new CelestialBody(MOON_RADIUS, "./images/moon.jpg");
    moon.setName("moon");
    moon.setPosition(-EARTH_MOON_DISTANCE, 0, 0);
    moon.setRotation(MOON_ROTATION_SPEED);
    moon.setRevolution(EARTH_MOON_DISTANCE, 1 / 3);
    moon.setupEvents();

    earth.connectToCB(moon.getCentre());
    sun.connectToCB(earth.getCentre());
    this.scene.add(sun.getCentre());
  }

  setupSky() {
    const texture = textureLoader.load("./images/space.webp");
    texture.colorSpace = THREE.SRGBColorSpace;

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(20),
      new THREE.MeshStandardMaterial({ map: texture, side: THREE.BackSide })
    );
    sky.position.set(2, 0, 0);

    this.scene.add(sky);
  }

  setupLight() {
    const hasDebugMode = this.hasDebugMode();

    const ambientLight = new THREE.AmbientLight(0x222222, 60);
    this.scene.add(ambientLight);

    if (hasDebugMode) {
      this.gui
        .add(ambientLight, "intensity")
        .min(15)
        .max(40)
        .step(1)
        .name("Ambient light");
    }

    const sunLight = new THREE.PointLight(0xffffff, 400);
    sunLight.position.set(0, 0, -5);
    sunLight.castShadow = true;

    sunLight.shadow.camera.near = 20;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;

    this.scene.add(sunLight);

    if (hasDebugMode) {
      this.gui
        .add(sunLight, "intensity")
        .min(20)
        .max(50)
        .step(1)
        .name("Sunlight light");
    }
  }

  hasDebugMode = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.has("debug") && queryParams.get("debug") === "true";
  };
}

export default SolarSystem;
