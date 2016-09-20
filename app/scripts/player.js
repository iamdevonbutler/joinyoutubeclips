const YT = require('youtube-player');
const utils = require('./utils');

var $playerWrapper,
  __activeId__ = '0.0',
  __players__ = {},
  __playerTime__ = 0,
  __data__,
  __playerChangeCallback__,
  __timeChangeCallback__,
  __onPauseCallback__,
  __onPlayCallback__;

function cache(data) {
  __data__ = data;
  $playerWrapper = $('#playerWrapper');
}

function addPlayer(id, vid, active = false) {
  var item = `<li data-id="${id}" ${active ? 'class="active"' : ''}><div></div></li>`;

  const {startTime, endTime} = utils.getClipRange(__data__, id);

  // Add item to DOM.
  $playerWrapper.append(item);
  var el = $playerWrapper.children().last().children()[0];

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
    let player = event.target;
    let id = $(player.a).parent().attr('data-id');

    let ended = event.data === 0;
    let playing = event.data === 1;
    let paused = event.data === 2;

    let currentTime = player.getCurrentTime();

    if (playing) {
      if (__onPlayCallback__) __onPlayCallback__.call(null, id, currentTime);
    }

    if (paused) {
      if (__onPauseCallback__) __onPauseCallback__.call(null, id, currentTime);
    }

    if (ended) {
      let nextId = utils.getNextIdFromData(__data__, id);
      if (nextId) {
        switchPlayer(nextId);
      }
      else {
        // If on the last clip, reset player to beginning but don't autoplay.
        switchPlayer('0.0', false);
      }
      // Reset original video to beginning.
      // let segments = utils.getSegmentFromData(__data__, id);
      // let startTime = segments[0];
      // player.seekTo(startTime);
    }
  });

}

function addPlayers(data) {
  data.forEach((item, i) => {
    item.segments.forEach((segment, ii) => {
      let active = i === 0 && ii === 0;
      let id = `${i}.${ii}`;
      addPlayer(id, item.vid, active);
    });
  });
}

function getVideoById(id) {
  return $playerWrapper.find(`> [data-id="${id}"]`);
}

// @todo hack - this is an async operation and we really should return a promise.
function changePlayerDisplay(id) {
  var $el = getVideoById(id);
  $playerWrapper.children().removeClass('active');
  $el.addClass('active');
}

// @todo hack - async not handled properly.
function switchPlayer(id, playVideo = true) {
  var currentPlayer = __players__[__activeId__];
  var nextPlayer = __players__[id];
  __activeId__ = id; // Update activeId in hacky closure state.

  changePlayerDisplay(id);
  currentPlayer.pauseVideo();
  let currentTime = nextPlayer.getCurrentTime();
  // Call registered callbacks.
  if (__playerChangeCallback__) {
    __playerChangeCallback__.call(null, id, currentTime);
  }
  if (playVideo) {
    nextPlayer.playVideo();
  }
}

// @todo use DI
function bufferPlayers(players) {
  var keys = Object.keys(players);
  keys.forEach((key, i) => {
    let player = players[key];
    if (i === 0) return;
    player.playVideo();
    player.pauseVideo();
  });
}

function init(data) {
  cache(data);
  addPlayers(data);
  bufferPlayers(__players__);
}

module.exports.init = init;

module.exports.switchPlayer = switchPlayer;

module.exports.onPlayerChange = (callback) => {
  __playerChangeCallback__ = callback;
}

module.exports.getCurrentTime = (callback) => {
  return __players__[__activeId__].getCurrentTime();
}

module.exports.onPause = (callback) => {
  __onPauseCallback__ = callback;
}

module.exports.onPlay = (callback) => {
  __onPlayCallback__ = callback;
}
