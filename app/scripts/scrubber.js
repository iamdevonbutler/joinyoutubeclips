const utils = require('./utils');

/**
 * @todo make resize event optional.
 * @todo make jquery free
 * @todo add custom cursor styling (via JS and CSS maybe)
 */

class Scrubber {

  constructor(params) {
    // Set vars.
    const {startTime, endTime, canvasId, cursorColor} = params;
    this._startTime = startTime;
    this._endTime = endTime;
    this._canvasId = canvasId;
    this._cursorColor = cursorColor || '#5bff7a';

    this._cache();
    this._bindEvents();
    this._canvasWidth = this._getCanvasWidth();
    this._initCanvas();
    this._drawCursor(0);

    var self = this;
    setTimeout(() => {
      console.log(8);
        self._animateCursor(0);
    }, 1000);
  }

  _getCanvasWidth() {
    return this._$canvasWrapper.width();
  }

  _initCanvas() {
  	var canvas = this._$canvasWrapper[0];
  	var ctx = canvas.getContext('2d');

  	canvas.width = this._canvasWidth;
  	canvas.height = 24;

    // Set vars.
    this._canvas = canvas;
    this._ctx = ctx;
  }

  _drawCursor(xPos) {
    var ctx = this._ctx;
    ctx.beginPath();
    ctx.fillStyle = this._cursorColor;
    ctx.fillRect(xPos, 0, 1, 24);
    ctx.closePath();
  }

  _clearCursor(xPos) {
    var ctx = this._ctx;
    ctx.clearRect(xPos, 0, 1, 24);
  }

  _animateCursor(xPos) {
    var ctx = this._ctx;
    var self = this;

    this._clearCursor(xPos);
    this._drawCursor(xPos+1);

    requestAnimationFrame(() => {
      self._animateCursor(xPos+1);
    });
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

  start(start) {
    var duration = this._endTime - this._startTime;
    var length = duration - start;
    var pos = start > 0 ? (start / length) * this._canvasWidth : this._canvasWidth;
  }

  pause() {}
  restart() {}

  onEnd() {}
  onClick() {}

  onTimeChange() {}
  getTime() {}

}

/**
 * Constructor function.
 */
module.exports = Scrubber;
