
//import * as BABYLON from "./node_modules/babylonjs/babylon.js";
// Game world
export default class World {
  constructor() {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);
    // Scene
    const scene = new BABYLON.Scene(engine);
    scene.ambientColor = new BABYLON.Color3(0, 0, 0);
    // Camera
    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    
    // Events
    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
      engine.resize();
    });
    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      //if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
      if (ev.key === 'F4') {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        }
        else {
          scene.debugLayer.show();
        }
      }
    });
    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}