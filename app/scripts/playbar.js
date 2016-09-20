const utils = require('./utils');

class Playbar {

  constructor(params) {
    // Set vars.
    const {startTime, endTime, canvasId, cursorColor} = params;
    this._clipStartTime = startTime;
    this._clipEndTime = endTime;
    this._canvasId = canvasId;
    this._cursorColor = cursorColor || '#5bff7a';
    this._animationFrameRequestId;
    this._getTimeCallback;
    this._playbarChangeCallback;
    this._playbarWidth;
    this._playbarLeftBoundXPos;

    this._cache();
    this._initCanvas();
    this._bindEvents();
  }

  _getPlaybarWidth() {
    return this._$playbarWrapper.width();
  }

  _getPlaybarLeftBoundXPos() {
    return this._$playbarWrapper[0].getBoundingClientRect().left;
  }

  _initCanvas() {
    var canvas, ctx;
    this._playbarWidth = this._getPlaybarWidth();
    this._playbarLeftBoundXPos = this._getPlaybarLeftBoundXPos();

  	canvas = this._$playbarWrapper[0];
  	ctx = canvas.getContext('2d');

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
    var $window, resizeHandler;
    $window = $(window);

    $window.on('resize', ((event) => {
      this._playbarWidth = this._$playbarWrapper.width();
      this._playbarLeftBoundXPos = this._getPlaybarLeftBoundXPos();
      this._clearPlaybar();
      this._initCanvas();
    }).bind(this));

    this._$playbarWrapper.on('click', ((event) => {
      var xPos, newTime;
      if (this._playbarChangeCallback) {
        xPos = event.clientX - this._getPlaybarLeftBoundXPos();
        newTime = this._getClipTimeFromXPos(xPos);
        this._clearPlaybar();
        this._playbarChangeCallback.call(null, newTime);
      }
    }).bind(this));
  }

  _clearPlaybar() {
    this._ctx.clearRect(0, 0, this._playbarWidth, 4);
  }

  _getCurrentTime() {
    if (!this._getTimeCallback) {
      throw new Error('Callback not specified. Add callback using .registerTimeCallback()');
    }
    return this._getTimeCallback.call(null);
  }

  _getPlaybarTimeFromXPos(xPos) {
    var time, duration;
    duration = this._clipEndTime - this._clipStartTime;
    time = xPos > 0 ? (xPos / this._playbarWidth) * duration : 0;
    return time;
  }

  _getClipTimeFromXPos(xPos) {
    var time, relativeTime;
    time = this._getPlaybarTimeFromXPos(xPos);
    relativeTime = time + this._clipStartTime;
    return relativeTime;
  }

  _getPlaybarXPosFromTime(time) {
    var duration, relativeTime, xPos;
    duration = this._clipEndTime - this._clipStartTime;
    relativeTime = time - this._clipStartTime;
    xPos = relativeTime > 0 ? (relativeTime / duration) * this._playbarWidth : 0;
    return xPos;
  }

  _drawCursor(xPos) {
    var ctx;
    ctx = this._ctx;
    ctx.beginPath();
    ctx.fillStyle = this._cursorColor;
    ctx.fillRect(0, 0, xPos, 4);
    ctx.closePath();
  }

  _animateCursor(xPos) {
    this._drawCursor(xPos);
    this._animationFrameRequestId = requestAnimationFrame((() => {
      this._getCurrentTime().then(this.start.bind(this));
    }).bind(this));
  }

  start(time) {
    var xPos;
    xPos = this._getPlaybarXPosFromTime(time);
    this._animateCursor(xPos);
  }

  reset(startTime, endTime) {
    console.log('reset');
    this.pause();
    this._clearPlaybar();
    this._clipStartTime = startTime !== undefined ? startTime : this._clipStartTime;
    this._clipEndTime = endTime !== undefined ? endTime : this._clipEndTime;
  }

  pause() {
    cancelAnimationFrame(this._animationFrameRequestId);
  }

  onPlaybarChange(callback) {
    // passes callback the resolved clip time, not the playbar time.
    this._playbarChangeCallback = callback;
  }

  registerTimeCallback(callback) {
    this._getTimeCallback = callback;
  }

}

/**
 * Constructor function.
 */
module.exports = Playbar;
