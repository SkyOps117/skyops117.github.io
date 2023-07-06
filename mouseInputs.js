export default class FreeCameraSearchInput {
  constructor(touchEnabled) {
    if (touchEnabled === void 0) { touchEnabled = true; }
    this.touchEnabled = touchEnabled;
    this.buttons = [0, 1, 2];
    this.angularSensibility = 2000.0;
    this.restrictionX = 100;
    this.restrictionY = 60;
  }
  //add attachment control which also contains the code to react to the input from the mouse 
  attachControl(noPreventDefault) {
    var _this = this;
    var engine = this.camera.getEngine();
    var element = engine.getInputElement();
    var angle = { x: 0, y: 0 };
    if (!this._pointerInput) {
      this._pointerInput = function (p, s) {
        var evt = p.event;
        if (!_this.touchEnabled && evt.pointerType === "touch") {
          return;
        }
        if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && _this.buttons.indexOf(evt.button) === -1) {
          return;
        }
        if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          try {
            evt.srcElement.setPointerCapture(evt.pointerId);
          }
          catch (e) {
            //Nothing to do with the error. Execution will continue.
          }
          _this.previousPosition = {
            x: evt.clientX,
            y: evt.clientY
          };
          if (!noPreventDefault) {
            evt.preventDefault();
            element.focus();
          }
        }
        else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
          try {
            evt.srcElement.releasePointerCapture(evt.pointerId);
          }
          catch (e) {
            //Nothing to do with the error.
          }
          _this.previousPosition = null;
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
        else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
          if (!_this.previousPosition || engine.isPointerLock) {
            return;
          }
          var offsetX = evt.clientX - _this.previousPosition.x;
          var offsetY = evt.clientY - _this.previousPosition.y;
          angle.x += offsetX;
          angle.y -= offsetY;
          if (Math.abs(angle.x) > _this.restrictionX) {
            angle.x -= offsetX;
          }
          if (Math.abs(angle.y) > _this.restrictionY) {
            angle.y += offsetY;
          }
          if (_this.camera.getScene().useRightHandedSystem) {
            if (Math.abs(angle.x) < _this.restrictionX) {
              _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
            }
          }
          else {
            if (Math.abs(angle.x) < _this.restrictionX) {
              _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
            }
          }
          if (Math.abs(angle.y) < _this.restrictionY) {
            _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
          }
          _this.previousPosition = {
            x: evt.clientX,
            y: evt.clientY
          };
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
    }
    this._onSearchMove = function (evt) {
      if (!engine.isPointerLock) {
        return;
      }
      var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
      var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
      if (_this.camera.getScene().useRightHandedSystem) {
        _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
      }
      else {
        _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
      }
      _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
      _this.previousPosition = null;
      if (!noPreventDefault) {
        evt.preventDefault();
      }
    };
    this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE);
    element.addEventListener("mousemove", this._onSearchMove, false);
  }
  //Add detachment control
  detachControl() {
    var engine = this.camera.getEngine();
    var element = engine.getInputElement();
    if (this._observer && element) {
      this.camera.getScene().onPointerObservable.remove(this._observer);
      element.removeEventListener("mousemove", this._onSearchMove);
      this._observer = null;
      this._onSearchMove = null;
      this.previousPosition = null;
    }
  }
  //Add the two required functions for names
  getClassName() {
    return "FreeCameraSearchInput";
  }
  getSimpleName() {
    return "MouseSearchCamera";
  }
}