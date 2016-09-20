const utils = require('./utils');

/**
 * @todo make resize event optional.
 * @todo make jquery free
 * @todo add custom cursor styling (via JS and CSS maybe) provide ctx to a callback.
 */

class Playbar {

  constructor(params) {
    // Set vars.
    const {startTime, endTime, canvasId, cursorColor} = params;
    this._startTime = startTime;
    this._endTime = endTime;
    this._canvasId = canvasId;
    this._cursorColor = cursorColor || '#5bff7a';
    this._frameCount = 0;
    this._frameCountOffset = 0; // little hack, reqAniFrame does not reset it's counter.

    this._cache();
    this._bindEvents();
    this._playbarWidth = this._getPlaybarWidth();
    this._initCanvas();
  }

  _getPlaybarWidth() {
    return this._$playbarWrapper.width();
  }

  _initCanvas() {
  	var canvas = this._$playbarWrapper[0];
  	var ctx = canvas.getContext('2d');

  	canvas.width = this._playbarWidth;
  	canvas.height = 4;

    // Set vars.
    this._canvas = canvas;
    this._ctx = ctx;
  }

  _cache() {
    this._$playbarWrapper = $(`#${this._canvasId}`);
  }

  // @todo unbind on class destory.
  _bindEvents() {
    var $window = $(window);
    // @todo this does not update the playar itself, just a param.
    var handler = () => this._playbarWidth = this._$playbarWrapper.width();
    $window.on('resize', handler);
    /**
     * API public.
     */
    this.destroy = () => {
      // @todo unbind animationframe.
      $window.unbind('resize', handler);
    };
  }

  _drawCursor(xPos) {
    var ctx = this._ctx;
    ctx.beginPath();
    ctx.fillStyle = this._cursorColor;
    ctx.fillRect(0, 0, xPos, 4);
    ctx.closePath();
  }

  _animateCursor(xOffset, deltaX, done) {
    var fc = this._frameCount - this._frameCountOffset;
    console.log(xOffset + deltaX*fc, fc);
    this._drawCursor(xOffset + deltaX*fc);

    this._frameCount = requestAnimationFrame((() => {
      // console.log(fc);
      if (fc === done) this.pause();
      this._animateCursor(xOffset, deltaX, done);
    }).bind(this));
  }

  reset(startTime, endTime) {
    cancelAnimationFrame(this._frameCount);
    this._ctx.clearRect(0, 0, this._playbarWidth, 4);
    this._frameCountOffset = this._frameCount;
    this._startTime = startTime !== undefined ? startTime : this._startTime;
    this._endTime = endTime !== undefined ? endTime : this._endTime;
  }

  start(currentTime) {
    var duration = this._endTime - this._startTime;
    var animationTime = duration - currentTime;
    var distanceInPx = currentTime > 0 ? (animationTime / duration) * this._playbarWidth : this._playbarWidth;

    var deltaX = (distanceInPx / animationTime) / 60;
    var totalFrames = animationTime * 60;
    var startXPos = this._playbarWidth - distanceInPx;
    console.log(this._playbarWidth, totalFrames);
    this._animateCursor(startXPos, deltaX, totalFrames);
  }

  pause() {
    cancelAnimationFrame(this._frameCount);
  }

  play() {}
  move() {}

  onEnd() {}
  onClick() {}

}

/**
 * Constructor function.
 */
module.exports = Playbar;
