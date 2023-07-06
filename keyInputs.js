export default class FreeCameraKeyboardWalkInput {
  constructor() {
    this._keys = [];
    // W FORWARD
    this.keysUp = [87];
    // S BACKWARD
    this.keysDown = [83];
    // A LEFT
    this.keysLeft = [65];
    // D RIGHT
    this.keysRight = [68];
  }
  //Add attachment controls
  attachControl(noPreventDefault) {
    var _this = this;
    var engine = this.camera.getEngine();
    var element = engine.getInputElement();
    if (!this._onKeyDown) {
      element.tabIndex = 1;
      this._onKeyDown = function (evt) {
        if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
          _this.keysDown.indexOf(evt.keyCode) !== -1 ||
          _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
          _this.keysRight.indexOf(evt.keyCode) !== -1) {
          var index = _this._keys.indexOf(evt.keyCode);
          if (index === -1) {
            _this._keys.push(evt.keyCode);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      this._onKeyUp = function (evt) {
        if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
          _this.keysDown.indexOf(evt.keyCode) !== -1 ||
          _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
          _this.keysRight.indexOf(evt.keyCode) !== -1) {
          var index = _this._keys.indexOf(evt.keyCode);
          if (index >= 0) {
            _this._keys.splice(index, 1);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      element.addEventListener("keydown", this._onKeyDown, false);
      element.addEventListener("keyup", this._onKeyUp, false);
    }
  }
  //Add detachment controls
  detachControl() {
    var engine = this.camera.getEngine();
    var element = engine.getInputElement();
    if (this._onKeyDown) {
      element.removeEventListener("keydown", this._onKeyDown);
      element.removeEventListener("keyup", this._onKeyUp);
      BABYLON.Tools.UnregisterTopRootEvents(canvas, [
        { name: "blur", handler: this._onLostFocus }
      ]);
      this._keys = [];
      this._onKeyDown = null;
      this._onKeyUp = null;
    }
  }
  // KEY MOVEMENT CONTROL
  checkInputs() {
    if (this._onKeyDown) {
      var camera = this.camera;
      for (var index = 0; index < this._keys.length; index++) {
        var keyCode = this._keys[index];
        var speed = camera.speed;
        if (this.keysLeft.indexOf(keyCode) !== -1) {
          //camera.rotation.y -= camera.angularSpeed;
          camera.direction.copyFromFloats(-speed, 0, 0);
        }
        else if (this.keysUp.indexOf(keyCode) !== -1) {
          camera.direction.copyFromFloats(0, 0, speed);
        }
        else if (this.keysRight.indexOf(keyCode) !== -1) {
          //camera.rotation.y += camera.angularSpeed;
          camera.direction.copyFromFloats(speed, 0, 0);
        }
        else if (this.keysDown.indexOf(keyCode) !== -1) {
          camera.direction.copyFromFloats(0, 0, -speed);
        }
        if (camera.getScene().useRightHandedSystem) {
          camera.direction.z *= -1;
        }
        camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
        BABYLON.Vector3.TransformNormalToRef(camera.direction, camera._cameraTransformMatrix, camera._transformedDirection);
        camera.cameraDirection.addInPlace(camera._transformedDirection);
      }
    }
  }
  // Add the onLostFocus function
  _onLostFocus(e) {
    this._keys = [];
  }
  //Add the two required functions for the control Name
  getClassName() {
    return "FreeCameraKeyboardWalkInput";
  }
  getSimpleName() {
    return "keyboard";
  }
}