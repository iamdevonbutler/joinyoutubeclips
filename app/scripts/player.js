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
  var item, el;
  const {startTime, endTime} = utils.getClipRange(__data__, id);

  item = `<li data-id="${id}" ${active ? 'class="active"' : ''}><div></div></li>`;

  // Add item to DOM.
  $playerWrapper.append(item);
  el = $playerWrapper.children().last().children()[0];

  __players__[id] = YT(el, {
    videoId: vid,
    playerVars: {
      autoplay: 0,
      controls: 0,
      start: startTime,
      end: endTime,
    }
  });

  __players__[id].on('stateChange', (event) => {
    var player, id, ended, playing, paused, currentTime;

    player = event.target;
    id = $(player.a).parent().attr('data-id');

    ended = event.data === 0;
    playing = event.data === 1;
    paused = event.data === 2;

    currentTime = player.getCurrentTime();

    if (playing) {
      if (__onPlayCallback__) __onPlayCallback__.call(null, id, currentTime);
    }

    if (paused) {
      if (__onPauseCallback__) __onPauseCallback__.call(null, id, currentTime);
    }

    if (ended) {
      const nextId = utils.getNextIdFromData(__data__, id);
      if (nextId) {
        switchPlayer(nextId);
      }
      else {
        return;
        // If on the last clip, reset player to clip 1, but don't autoplay.
        const clip1Id = '0.0';
        const {startTime} = utils.getClipRange(__data__, '0.0');
        switchPlayer('0.0', false);
        __players__['0.0'].seekTo(startTime);
      }
    }
  });

}

function addPlayers(data) {
  data.forEach((item, i) => {
    item.segments.forEach((segment, ii) => {
      var active, id;
      active = i === 0 && ii === 0;
      id = `${i}.${ii}`;
      addPlayer(id, item.vid, active);
    });
  });
}

function getVideoById(id) {
  return $playerWrapper.find(`> [data-id="${id}"]`);
}

function changePlayerDisplay(id) {
  var $el;
  $el = getVideoById(id);
  $playerWrapper.children().removeClass('active');
  $el.addClass('active');
}

// @todo async (.playVideo()) not handled properly.
function switchPlayer(id, playVideo = true) {
  var currentPlayer, nextPlayer;
  currentPlayer = __players__[__activeId__];
  nextPlayer = __players__[id];
  __activeId__ = id; // Update activeId in hacky closure state.

  changePlayerDisplay(id);
  currentPlayer.pauseVideo();
  nextPlayer.getCurrentTime().then((currentTime) => {
    if (__playerChangeCallback__) {
      __playerChangeCallback__.call(null, id, currentTime);
    }
    if (playVideo) {
      nextPlayer.playVideo();
    }
  });
}

function bufferPlayers(players) {
  var keys;
  keys = Object.keys(players);
  keys.forEach((key, i) => {
    var player;
    player = players[key];
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

module.exports.seekTo = (time) => {
  return __players__[__activeId__].seekTo(time);
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
