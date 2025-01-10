import * as THREE from "three";

class Tick {
  callbackFunctions = [];
  constructor() {}

  registerCallback(fn) {
    this.callbackFunctions.push(fn);
  }

  startTick = () => {
    this.clock = new THREE.Clock();
    this.tick();
  };

  tick = () => {
    const elapsedTime = this.clock.getElapsedTime();

    this.callbackFunctions.forEach((fn) => fn(elapsedTime));

    window.requestAnimationFrame(this.tick);
  };
}

const TickInstance = new Tick();

export default TickInstance;
