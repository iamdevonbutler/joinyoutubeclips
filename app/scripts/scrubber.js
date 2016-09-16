const utils = require('./utils');

var $scrubberWrapper,
  $scrubberCursor,
  __scrubberWidth__;

// pos - value btw 0 - 1.
function updatePosition(currentTime, startTime, endTime) {
  var duration = endTime - startTime;
  var pos = (currentTime / duration) * __scrubberWidth__;
  console.log(pos);
  $scrubberCursor[0].style['transform'] = "translateX(" + pos + "px) translateZ(0) scale(1)";
  // $scrubberCursor[0].style['-webkit-transform'] = "translateX(" + pos + "px) translateZ(0) scale(1)";

  // $scrubberCursor.css('transform', `translate3d(${pos}px, 0, 0`);
}

function cache() {
  $scrubberWrapper = $('#scrubberWrapper');
  $scrubberCursor = $('#scrubberCursor');
}

module.exports.init = () => {
  cache();
  __scrubberWidth__ = $scrubberWrapper.width();
  console.log(__scrubberWidth__);
  $(window).on('resize', () => {
    __scrubberWidth__ = $scrubberWrapper.width();
  });
};

module.exports.updatePosition = updatePosition;
