const YT = require('youtube-player');
const utils = require('./utils');

var $playerWrapper,
  __activeId__ = '0.0',
  __players__ = [],
  __data__,
  __callback__;

function cache(data) {
  __data__ = data;
  $playerWrapper = $('#playerWrapper');
}

function bindEvents() {

}

function addItem(id, vid, active = false) {
  var item = `<li data-id="${id}" ${active ? 'class="active"' : ''}><div></div></li>`;

  var segment = utils.getSegmentFromData(__data__, id);
  var startTime = segment[0];
  var endTime = segment[1];

  // Add item to DOM.
  $playerWrapper.append(item);
  var el = $playerWrapper.children().last().children()[0];
  console.log(startTime, endTime);
  __players__[id] = YT(el, {
    videoId: vid,
    playerVars: {
      autoplay: 0,
      controls: 0,
      start: startTime,
      end: endTime,
    }
  });

  // Add lisitener - auto switch to next video when over.
  __players__[id].on('stateChange', (event) => {
    let ended = event.data === 0;
    if (ended) {
      let id = $(event.target.a).parent().attr('data-id');
      let nextId = utils.getNextIdFromData(__data__, id);
      if (nextId) {
        switchVideo(nextId);
      }
    }
  });

}

function addItems(data) {
  data.forEach((item, i) => {
    item.segments.forEach((segment, ii) => {
      let active = i === 0 && ii === 0;
      let id = `${i}.${ii}`;
      addItem(id, item.vid, active);
    });
  });
}

function getVideoById(id) {
  return $playerWrapper.find(`> [data-id="${id}"]`);
}

// @todo hack - this is an async operation and we really should return a promise.
function changeVideoDisplay(id) {
  var $el = getVideoById(id);
  $playerWrapper.children().removeClass('active');
  $el.addClass('active');
}


// @todo hack - async not handled properly.
function switchVideo(id) {
  var currentPlayer = __players__[__activeId__];
  var nextPlayer = __players__[id];
  __activeId__ = id; // Update activeId in hacky closure state.

  changeVideoDisplay(id);
  currentPlayer.pauseVideo();
  nextPlayer.playVideo();
}

function init(data) {
  cache(data);
  addItems(data);
  // bindEvents();
}

module.exports.init = init;

module.exports.switch = switchVideo;

module.exports.onChange = (callback) => {
  __callback__ = callback;
}
