"use strict"
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Scene
function makeScene() {
  const scene = new BABYLON.Scene(engine);
  scene.ambientColor = new BABYLON.Color3(1, 1, 1);
  const dsm = new BABYLON.DeviceSourceManager(engine);


  // FreeCam
  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);
  // Targets the camera to center of scene
  //camera.setTarget(BABYLON.Vector3.Zero());
  const camRoot = new BABYLON.TransformNode("root");
  camera.attachControl(canvas, true);

  // REMOVE DEFAULT INPUTS
  camera.inputs.clear();
  camera.inputs.addMouseWheel();
  //camera.inputs.addMouse();

  camera.ellipsoid = new BABYLON.Vector3(1.0, 1.618, 1.0);
  camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);

  camera.fov = 1;
  camera.parent = camRoot;
  //scene.collisionsEnabled = true;
  //camera.checkCollisions = true;
  //camera.applyGravity = true;
  scene.activeCameras.push(camera);

  scene.onPointerMove = (e, info, type) => {
    const dx = e.movementX / (Math.PI * 2 * 160);
    const dy = e.movementY / (Math.PI * 2 * 90);

    if (camRoot.rotation.x < Math.PI / 2 && camRoot.rotation.x > -Math.PI / 2);
    camRoot.rotation.x += dy * 1.5;
    camRoot.rotation.y += dx * 5;
  }

  // Dome
  const dome = new BABYLON.PhotoDome("skyDome", "./assets/sky-dome.jpg",
    { resolution: 64, size: 6144, useDirectMapping: false }, scene);
  dome.material.backFaceCulling = false;
  //dome.material.reflectionTexture.coordinatesMode = 9;

  dome.imageMode = BABYLON.PhotoDome.MODE_MONOSCOPIC;
  dome.fovMultiplier = 1;
  dome.infiniteDistance = true;
  //dome.mesh.renderingGroupId = 0;
  // Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // Player
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere",
    { diameter: 2, segments: 32 },
    scene);
  sphere.parent = camRoot;
  sphere.position.y = 1;
  const sphereMat = new BABYLON.StandardMaterial("gMat", scene);
  //groundMat.transparencyMode = 2;
  sphereMat.alpha = 0.5;
  sphereMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  sphereMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  sphere.material = sphereMat;
  // Ground
  const ground = BABYLON.MeshBuilder.CreateGround("ground",
    { width: 10, height: 10},
    scene);
  const groundMat = new BABYLON.StandardMaterial("gMat", scene);
  //groundMat.transparencyMode = 2;
  groundMat.alpha = 0.5;
  groundMat.diffuseColor = new BABYLON.Color3(1, 0, 1);
  groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  //groundMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
  //groundMat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
  ground.material = groundMat;
// "Game" Loop
scene.registerBeforeRender(() => {
  if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard)) {
    let vdir = new BABYLON.Vector3(0, 0, 0);
    // Forward
    if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(87) == 1) {
      vdir = vdir.add(camRoot.forward);
    }
    // Backward
    if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(83) == 1) {
      vdir = vdir.subtract(camRoot.forward);
    }
    // Left
    if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(65) == 1) {
      vdir = vdir.subtract(camRoot.right);
    }
    // Right
    if (dsm.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(68) == 1) {
      vdir = vdir.add(camRoot.right);
    }
    camRoot.position = camRoot.position.add(vdir);
  }
});

  return scene;
};
const scene = makeScene();
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
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