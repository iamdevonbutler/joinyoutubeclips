const utils = require('./utils');

class Scrubber {

  constructor(startTime, endTime, easing = 'linear') {
    this._startTime = startTime;
    this._endTime = endTime;
    this._easing = easing;

    this._cache();
    this._bindEvents();

    this._pos = 0;
    this._scrubberWidth = this._$scrubberWrapper.width();
  }

  _cache() {
    this._$scrubberWrapper = $('#scrubberWrapper');
    this._$scrubberCursor = $('#scrubberCursor');
  }

  // @todo unbind on class destory.
  _bindEvents() {
    var handler = () => this._scrubberWidth = this._$scrubberWrapper.width();
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
    var pos = start > 0 ? (start / length) * this._scrubberWidth : this._scrubberWidth;
  }

  pause() {

  }

  restart() {}

  onEnd() {}
  onClick() {}
  onTimeChange() {}

  init() {
  	var canvas = document.getElementById('scrubberWrapper');
  	var ctx = canvas.getContext('2d');

  	canvas.width = this._scrubberWidth;
  	canvas.height = 24;

    var x = 0;

    function animate() {
      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.fillRect(x, 0, 1, 24);
      ctx.closePath();

      x += 2;

      ctx.beginPath();
      ctx.fillStyle = '#5bff7a';
      ctx.fillRect(x, 0, 1, 24);
      ctx.closePath();

      requestAnimationFrame(animate);
    }

    animate();
    // var x = 0;
    // ctx.beginPath();
    // ctx.fillStyle = '#5bff7a';
  	// ctx.fillRect(x, 0, 2, 24);
    // ctx.closePath();

    var self = this;
    setTimeout(() => {
      x = 0;
      self.init();
    }, 5000);

  }

}

/**
 * Constructor function.
 */
module.exports = Scrubber;
