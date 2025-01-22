import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats.js";

import TickInstance from "./tick";

const dimension = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export class Renderer {
  constructor(canvas, camera, scene) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(dimension.width, dimension.height);
    this.scene = scene;
    this.camera = camera;
    this.controls = new OrbitControls(camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.showStats();

    TickInstance.registerCallback(this.onTick);
    return this.renderer;
  }

  getRenderer() {
    return this.renderer;
  }

  showStats() {
    if (this.hasDebugMode()) {
      const stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
      this.stats = stats;
    }
  }

  hasDebugMode = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.has("debug") && queryParams.get("debug") === "true";
  };

  onTick = () => {
    const hasDebugMode = this.hasDebugMode();
    if (hasDebugMode) {
      this.stats.begin();
    }
    this.renderer.render(this.scene, this.camera);

    this.controls.update();
    if (hasDebugMode) {
      this.stats.end();
    }
  };
}
