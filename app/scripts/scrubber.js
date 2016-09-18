const utils = require('./utils');

class Scrubber {

  constructor(startTime, endTime, easing = 'linear') {
    this._startTime = startTime;
    this._endTime = endTime;
    this._easing = easing;

    this._prefix = this._getPrefix();
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

  _getPrefix() {
    var styles = window.getComputedStyle(document.documentElement, ''),
      pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
      )[1],
      dom = ('webkit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  }

  start(start) {
    var duration = this._endTime - this._startTime;
    var length = duration - start;
    var pos = start > 0 ? (start / length) * this._scrubberWidth : this._scrubberWidth;

    this._$scrubberCursor[0].style[this._prefix.dom + 'TransitionTimingFunction'] = this._easing;
    this._$scrubberCursor[0].style[this._prefix.dom + 'TransitionDuration'] = length * 1000 + 'ms';
    this._$scrubberCursor[0].style[this._prefix.dom + 'Transform'] = "translateX(" + pos + "px) translateZ(0) scale(1)";
  }

  pause() {
    this._$scrubberCursor[0].style[prefix.dom + 'TransitionDuration'] = 0 + 'ms';
    this._$scrubberCursor[0].style[prefix.dom + 'Transform'] = "translateX(" + 0 + "px) translateZ(0) scale(1)";
  }

  restart() {}

  onEnd() {}
  onClick() {}
  onTimeChange() {}

}

/**
 * Constructor function.
 */
module.exports = Scrubber;
