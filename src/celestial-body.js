import * as THREE from "three";
import TickInstance from "./tick";
import RaycasterClickInstance from "./raycaster-click";
const textureLoader = new THREE.TextureLoader();

export class CelestialBody {
  lastRotationTime = 0;
  currentRotation = 0;
  shouldRotate = false;

  lastRevolutionTime = 0;
  currentRevolution = 0;
  roughness = 0.4;

  constructor(radius, textureUrl) {
    this.textureUrl = textureUrl;
    this.radius = radius;
    this.create();
  }

  create() {
    const texture = textureLoader.load(this.textureUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshLambertMaterial({
      map: texture,
    });
    material.metalness = 0.4;

    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius), material);
    this.mesh.position.set(0, 0, 0);

    this.cog = new THREE.Group();
    this.cog.position.set(0, 0, 0);
    this.cog.add(this.mesh);
  }

  setPosition(...position) {
    this.cog.position.set(...position);
  }

  setName(name) {
    this.mesh.name = name;
  }

  setRotation(speed) {
    this.rotationSpeed = speed;
    this.shouldRotate = true;
    TickInstance.registerCallback(this.rotateOnTickCb);
  }
  setRevolution(radius, speed) {
    this.revolutionRadius = radius;
    this.revolutionSpeed = speed;
    this.shouldRevolve = true;
    TickInstance.registerCallback(this.revolveOnTickCb);
  }

  setupEvents() {
    RaycasterClickInstance.registerCallbackForObject(
      this.mesh.name,
      this.mesh,
      this.toggleRotation
    );
  }
  connectToCB(anotherBody) {
    this.cog.add(anotherBody);
  }

  getMesh() {
    return this.mesh;
  }

  getCentre() {
    return this.cog;
  }

  rotateOnTickCb = (elapsedTime) => {
    const deltaTime = elapsedTime - this.lastRotationTime;
    this.lastRotationTime = elapsedTime;
    if (this.shouldRotate && this.rotationSpeed) {
      this.currentRotation += deltaTime * this.rotationSpeed;
      this.mesh.rotation.y = this.currentRotation;
    }
  };

  revolveOnTickCb = (elapsedTime) => {
    const deltaTime = elapsedTime - this.lastRevolutionTime;
    this.lastRevolutionTime = elapsedTime;

    if (this.shouldRevolve && this.revolutionSpeed) {
      const revolutionDelta = deltaTime * this.revolutionSpeed;
      this.currentRevolution += revolutionDelta;

      this.cog.position.x =
        Math.cos(this.currentRevolution) * this.revolutionRadius;
      this.cog.position.y =
        Math.sin(this.currentRevolution) * this.revolutionRadius;
    }
  };

  toggleRotation = () => {
    this.shouldRotate = !this.shouldRotate;
    this.shouldRevolve = !this.shouldRevolve;
  };
}
