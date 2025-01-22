import * as THREE from "three";

const dimension = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export class RaycasterClick {
  clicked = false;
  callbackFunctions = {};
  intersectingObjects = [];

  constructor() {}

  registerCamera = (camera) => {
    this.raycaster = new THREE.Raycaster();
    this.camera = camera;

    window.addEventListener("click", this.click);
  };

  registerCallbackForObject(objectName, objectMesh, fn) {
    this.callbackFunctions[objectName] = fn;
    this.intersectingObjects.push(objectMesh);
  }

  click = (event) => {
    const mousePosX = (event.clientX / dimension.width) * 2 - 1;
    const mousePosY = -(event.clientY / dimension.height) * 2 + 1;
    this.raycaster.setFromCamera(
      new THREE.Vector2(mousePosX, mousePosY),
      this.camera
    );
    if (this.intersectingObjects.length > 0) {
      const intersects = this.raycaster.intersectObjects(
        this.intersectingObjects
      );

      const objectClicked = intersects[0]?.object.name;
      if (
        objectClicked &&
        this.callbackFunctions.hasOwnProperty(objectClicked)
      ) {
        this.callbackFunctions[objectClicked]();
      }
    }
  };
}

const RaycasterClickInstance = new RaycasterClick();
export default RaycasterClickInstance;
