const utils = require('./utils');

/**
 * @todo make resize event optional.
 * @todo make jquery free
 * @todo add custom cursor styling (via JS and CSS maybe) provide ctx to a callback.
 */

class Scrubber {

  constructor(params) {
    // Set vars.
    const {startTime, endTime, canvasId, cursorColor} = params;
    this._startTime = startTime;
    this._endTime = endTime;
    this._canvasId = canvasId;
    this._cursorColor = cursorColor || '#5bff7a';
    this._pause = false;

    this._cache();
    this._bindEvents();
    this._canvasWidth = this._getCanvasWidth();
    this._initCanvas();
    // this._drawCursor(0);

    var self = this;
    setTimeout(() => {
      console.log(8);
        self.start(0);
    }, 2000);
  }

  _getCanvasWidth() {
    return this._$canvasWrapper.width();
  }

  _initCanvas() {
  	var canvas = this._$canvasWrapper[0];
  	var ctx = canvas.getContext('2d');

  	canvas.width = this._canvasWidth;
  	canvas.height = 8;

    // Set vars.
    this._canvas = canvas;
    this._ctx = ctx;
  }

  _clearCursor(xPos) {
    var ctx = this._ctx;
    ctx.clearRect(xPos, 0, 2, 24);
  }

  _cache() {
    this._$canvasWrapper = $(`#${this._canvasId}`);
  }

  // @todo unbind on class destory.
  _bindEvents() {
    var handler = () => this._canvasWidth = this._$canvasWrapper.width();
    var $window = $(window);
    $window.on('resize', handler);
    /**
     * API public.
     */
    this.destory = () => $window.unbind('resize', handler);
  }

  _drawCursor(xPos) {
    var ctx = this._ctx;
    ctx.beginPath();
    ctx.fillStyle = this._cursorColor;
    ctx.fillRect(0, 0, xPos, 8);
    ctx.closePath();
  }

  _animateCursor(xPos, deltaX, done) {
    this._drawCursor(xPos+deltaX);

    this._frameCount = requestAnimationFrame((() => {
      var fc = this._frameCount;
      if (this._pause || fc === done) return;
      this._animateCursor(fc*deltaX, deltaX, done);
    }).bind(this));

  }

  start(startTime) {
    var totalDuration = this._endTime - this._startTime;
    var animationTime = totalDuration - startTime;
    var distanceInPx = startTime > 0 ? (animationTime / totalDuration) * this._canvasWidth : this._canvasWidth;

    var deltaX = (distanceInPx / animationTime) / 60;
    var totalFrames = animationTime * 60;
    var startXPos = startTime * deltaX;

    this._pause = false;
    this._animateCursor(startXPos, deltaX, totalFrames);
  }

  pause() {
    this._pause = true;
  }
  
  // restart() {}

  onEnd() {}
  onClick() {}

  onTimeChange() {}
  getTime() {}

}

/**
 * Constructor function.
 */
module.exports = Scrubber;
