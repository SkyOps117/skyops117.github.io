"use strict"
// import * as BABYLON from "../node_modules/babylonjs/babylon.js";
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
    
    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    function pointerlockchange() {
      //let controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
      let controlEnabled = document.pointerLockElement || null;
      //toggleFullScreen();
      // If the user is already locked
      if (!controlEnabled) {
        //console.log("EXIT FULLSCREEN");
        isFullScreen = false;
        canvas.style.height = window.innerHeight;
        canvas.height = window.innerHeight;
        scene.onPointerMove = () => { };
        engine.exitFullscreen();
      } else {
        //console.log("ENTER FULLSCREEN");
        isFullScreen = true;
        canvas.style.height = window.screen.height;
        canvas.height = window.screen.height;
        engine.enterFullscreen();
      }
    }
    document.addEventListener("pointerlockchange", pointerlockchange, false);

    // PointerDown event
    function onPointerDown(e, info, type) {
      // Check fullscreen. Faster than checking pointerlock on each single click.
      if (!isFullScreen) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
          canvas.requestPointerLock();
        }
      }
      // Add mouse moved function
      // evt: BABYLON.IPointerEvent, pickInfo: BABYLON.PickingInfo, type: BABYLON.PointerEventTypes
      scene.onPointerMove = (e, info, type) => {
        //console.log("MouseX moved:" + e.movementX);
        const dx = e.movementX / (Math.PI * 2 * 160);
        const dy = e.movementY / (Math.PI * 2 * 90);

        if (CoT.rotation.x < Math.PI / 2 && CoT.rotation.x > -Math.PI / 2);
        CoT.rotation.x += dy;

        //console.log(CoT.rotation.x);
        CoT.rotation.y += dx;
      }

      // Add LeftCLick Code too! :P
      //e === 1 (mouse wheel click (not scrolling))
      //e === 2 (right mouse click)

    }
    scene.onPointerDown = this.onPointerDown;

    // Windows resize event
    window.addEventListener("resize", function () {
      engine.resize();
    });

    // Add the event listener
    document.addEventListener("keydown", (event) => {
      //console.log(event.key);
      const forbitKeys = (event.key === "F1" || event.key === "F2" || event.key === "F3" || event.key === "F4" || event.key === "Tab");
      if ((event.ctrlKey || event.shiftKey) || forbitKeys) { // && event.key != "f12"
        event.preventDefault();
      }
    }, false);

    // Hide or show inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      //if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
      if (ev.key === 'F8') {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        }
        else {
          scene.debugLayer.show();
        }
      }
    });

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }


}