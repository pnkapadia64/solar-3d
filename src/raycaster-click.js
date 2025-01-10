import * as THREE from "three";
import TickInstance from "./tick";

const dimension = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export class RaycasterClick {
  clicked = false;
  callbackFunctions = {};
  intersectingObjects = [];

  constructor() {}

  registerTick = (camera) => {
    this.raycaster = new THREE.Raycaster();
    this.mousePos = new THREE.Vector2();
    this.camera = camera;

    window.addEventListener("click", this.click);
    TickInstance.registerCallback(this.tickCallback);
  };

  tickCallback = () => {
    this.raycaster.setFromCamera(this.mousePos, this.camera);
    if (this.intersectingObjects.length > 0) {
      const intersects = this.raycaster.intersectObjects(
        this.intersectingObjects
      );

      if (this.clicked) {
        const objectClicked = intersects[0]?.object.name;
        if (
          objectClicked &&
          this.callbackFunctions.hasOwnProperty(objectClicked)
        ) {
          this.callbackFunctions[objectClicked]();
        }
        this.clicked = false;
      }
    }
  };

  registerCallbackForObject(objectName, objectMesh, fn) {
    this.callbackFunctions[objectName] = fn;
    this.intersectingObjects.push(objectMesh);
  }

  click = (event) => {
    this.mousePos.x = (event.clientX / dimension.width) * 2 - 1;
    this.mousePos.y = -(event.clientY / dimension.height) * 2 + 1;
    this.clicked = true;
  };
}

const RaycasterClickInstance = new RaycasterClick();
export default RaycasterClickInstance;
