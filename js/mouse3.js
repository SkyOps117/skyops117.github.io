"use strict"
// Game world canvas
export default function mouse3() {
  // Body styling
  const body = document.body;
  body.style.padding = 0;
  body.style.margin = 0;
  body.style.width = "100%";
  body.style.height = "100%";
  body.style.background = "#333333";
  body.style.overflow = "hidden";
  
  // body.style.textAlign = "center";
  // body.style.placeContent = "center";
  // body.style.fontFamily = "monospace";

  // Canvas creation
  const canvas = document.createElement("canvas");
  canvas.style.padding = 0;
  canvas.style.margin = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = 999;
  canvas.style.position = "relative";
  canvas.style.cursor = "none";
  document.body.appendChild(canvas);

  //const canvas = document.getElementById("renderCanvas");

  // Engine
  const engine = new BABYLON.Engine(canvas, true);
  // Scene
  const scene = new BABYLON.Scene(engine);
  scene.ambientColor = new BABYLON.Color3(0, 0, 0);
  // Scene transparency
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  // CamRoot
  const playerRoot = new BABYLON.TransformNode("root", scene);
  playerRoot.position = new BABYLON.Vector3(0, 2, 0);
  // Test player
  const playerMesh = BABYLON.MeshBuilder.CreateCapsule("player", { width: 1, height: 1.618, depth: 1, size: 1 }, scene);
  playerMesh.position = playerRoot.position;
  playerMesh.parent = playerRoot;
  // Player Mats
  const playerMat = new BABYLON.StandardMaterial("material", scene);
  //material.diffuseTexture = new BABYLON.Texture("./assets/sky-dome.jpg", scene);
  //material.reflectionTexture = new BABYLON.CubeTexture("./assets/sky-dome.jpg", scene);
  playerMat.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
  //material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  playerMat.alpha = 0.75;
  playerMesh.material = playerMat;
  // Camera
  const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 10, playerRoot.position, scene);
  camera.attachControl(canvas, true);
  //camera.inputs.clear();
  //camera.inputs.addPointers();
  //camera.inputs.addMouseWheel();
  //camera.ellipsoid = new BABYLON.Vector3(1.0, 1.618, 1.0);
  //camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
  camera.fov = 0.8;
  //camera.panningSensibility = 0.1;

  camera.upperBetaLimit = Math.PI;
  camera.lowerBetaLimit = 0;
  //camera.setTarget(playerRoot.position);
  scene.activeCameras.push(camera);
  camera.parent = playerRoot;
  playerRoot.rotation.y = camera.alpha;


  // Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // Ground
  const groundMat = new BABYLON.StandardMaterial("material", scene);
  //material.diffuseTexture = new BABYLON.Texture("./assets/sky-dome.jpg", scene);
  //material.reflectionTexture = new BABYLON.CubeTexture("./assets/sky-dome.jpg", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  //material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  groundMat.alpha = 0.75;
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);
  ground.material = groundMat;
  // Dome
  // const dome = new BABYLON.PhotoDome("skyDome", "./assets/sky-dome.jpg",
  //   { resolution: 64, size: 6144, useDirectMapping: false }, scene);
  // dome.material.backFaceCulling = false;
  // //dome.material.reflectionTexture.coordinatesMode = 9;
  // dome.imageMode = BABYLON.PhotoDome.MODE_MONOSCOPIC;
  // dome.fovMultiplier = 1;
  // dome.infiniteDistance = true;

  // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
  let isFullScreen = false;
  function changePointerLock() {
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
  document.addEventListener("pointerlockchange", changePointerLock, false);

  // Mouse cursor
  const cursor = BABYLON.MeshBuilder.CreateBox("cur", { width: 0.1, height: 0.1, depth: 0.1, }, scene);
  const cursorMaterial = new BABYLON.StandardMaterial("", scene);
  cursorMaterial.alpha = 0.75;
  cursorMaterial.ambientColor = new BABYLON.Color3(1, 1, 0);
  cursor.material = cursorMaterial;

  function updateCursor() {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    const worldPosition = pickInfo.pickedPoint;
    const pickPosition = pickInfo.ray.direction;
    const orgPosition = pickInfo.ray.origin;
    cursor.position.x = pickInfo.ray.origin.x + pickInfo.ray.direction.x * 0.2;
    cursor.position.y = pickInfo.ray.origin.y + pickInfo.ray.direction.y * 0.2;
    cursor.position.z = pickInfo.ray.origin.z + pickInfo.ray.direction.z * 0.2;
  }

  // Mouse moved event
  scene.onPointerMove = (evt) => {
    updateCursor();
    // Log pointer position without decimal
    // console.log(scene.pointerX.toFixed(0), scene.pointerY.toFixed(0));
    // const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    // const worldPosition = pickInfo.pickedPoint;
    // const pickPosition = pickInfo.ray.direction;
    // const orgPosition = pickInfo.ray.origin;
    // cursor.position.x = pickInfo.ray.origin.x + pickInfo.ray.direction.x * 4;
    // cursor.position.y = pickInfo.ray.origin.y + pickInfo.ray.direction.y * 4;
    // cursor.position.z = pickInfo.ray.origin.z + pickInfo.ray.direction.z * 4;
    // const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === pickPlane);
    // console.log(pickInfo);
    // if (pickInfo.hit) {
    //     rectangle.left = scene.pointerX - rectangleWidth/2;
    //     rectangle.top = scene.pointerY - rectangleHeight/2;

    //     rectangle.isVisible = true;
    //     const worldPointer = pickInfo.pickedPoint;

    //     text.text = `x: ${worldPointer.x.toFixed(1)}, y: ${worldPointer.y.toFixed(1)}, z: ${worldPointer.z.toFixed(1)}`;
    // } else {
    //     // OFFSCREEN ?
    // }

  }



  // DeviceManager
  // const deviceSourceManager = new BABYLON.DeviceSourceManager(engine);
  // deviceSourceManager.onDeviceConnectedObservable.add((deviceSource) => {
  //   // Mouse/Touch
  //   if (deviceSource.deviceType === BABYLON.DeviceType.Mouse || deviceSource.deviceType === BABYLON.DeviceType.Touch) {
  //     deviceSource.onInputChangedObservable.add((eventData) => {
  //       if (eventData.inputIndex === BABYLON.PointerInput.Move) {

  //         console.log("Type: " + BABYLON.DeviceType[deviceSource.deviceType] + "\n\r Index:" + BABYLON.PointerInput[eventData.inputIndex]);
  //       }
  //     });
  //   }
  //   // Keyboard
  //   else if (deviceSource.deviceType === BABYLON.DeviceType.Keyboard) {
  //     deviceSource.onInputChangedObservable.add((eventData) => {
  //       // console.log("Type: " + BABYLON.DeviceType[deviceSource.deviceType] + "\n\r Value:" + eventData.code);
  //     });
  //   }
  // });

  // PointerDown event (old)
  // function onPointerDown(e, info, type) {
  //   // Check fullscreen. Faster than checking pointerlock on each single click.
  //   if (!isFullScreen) {
  //     canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
  //     if (canvas.requestPointerLock) {
  //       canvas.requestPointerLock();
  //     }
  //   }
  //   // Add mouse moved function
  //   // evt: BABYLON.IPointerEvent, pickInfo: BABYLON.PickingInfo, type: BABYLON.PointerEventTypes
  //   function pointerMove(e, info, type) {
  //     //console.log("MouseX moved:" + e.movementX);
  //     const dx = e.movementX / (Math.PI * 2 * 160);
  //     const dy = e.movementY / (Math.PI * 2 * 90);
 
  //     if (camRoot.rotation.x < Math.PI / 2 && camRoot.rotation.x > -Math.PI / 2) {
  //       camRoot.rotation.x += dy;
  //     }
  //     else {
  //       camRoot.rotation.x = -Math.PI / 2;
  //     }
  //     //console.log(CoT.rotation.x);
  //     camRoot.rotation.y += dx;
  //   }
  //   scene.onPointerMove = pointerMove;

  //   // Add LeftCLick Code too! :P
  //   //e === 1 (mouse wheel click (not scrolling))
  //   //e === 2 (right mouse click)

  // }
  // scene.onPointerDown = onPointerDown;

  scene.onPointerDown = (event, info, type) => {
    console.log(event.button + " " + info + " " + type);
    console.log(info.pickedPoint);
    const btnIndex = event.button;
    switch (btnIndex) {
      case 0:

        break;
      case 1:

        break;
      case 2:

        break;
      case 3:

        break;
      case 4:

        break;
      default:
        console.log("Unsupported mouse button event.");
        break;
    }
    // Mouse button click index
    // event.button === number
    // 0 Left
    // 1 wheel
    // 2 right
    // 3 backward
    // 4 forward
  };


  // Window resize event
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

  const dsm = new BABYLON.DeviceSourceManager(engine);
  // "Game" Loop
  scene.registerBeforeRender(() => {
    // KEYS
    const keyB = dsm.getDeviceSource(BABYLON.DeviceType.Keyboard);
    if (keyB) {
      let vdir = new BABYLON.Vector3(0, 0, 0);
      // Forward
      if (keyB.getInput(87) == 1) {
        vdir = vdir.add(playerRoot.forward);
      }
      // Backward
      if (keyB.getInput(83) == 1) {
        vdir = vdir.subtract(playerRoot.forward);
      }
      // Left
      if (keyB.getInput(65) == 1) {
        vdir = vdir.subtract(playerRoot.right);
      }
      // Right
      if (keyB.getInput(68) == 1) {
        vdir = vdir.add(playerRoot.right);
      }
      playerRoot.position = playerRoot.position.add(vdir);
    }
  });


  // Render loop
  engine.runRenderLoop(() => {
    scene.render();
  });

  return canvas;
}
//export default World;